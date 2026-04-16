import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import { redis } from 'src/lib/redis';
@Injectable()
export class Sockets {
  USER_SOCKET_MAP = 'user.socket';
  SOCKET_USER_MAP = 'socket.user';
  USER_ROOM_MAP = 'user.map';
  async getSocketId({ userId }: { userId: string }) {
    const id = await redis.hget(this.USER_SOCKET_MAP, userId);
    return id;
  }
  async getUserId({ socketId }: { socketId: string }) {
    const id = await redis.hget(this.SOCKET_USER_MAP, socketId);
    return id;
  }
  async setSocketId({
    userId,
    socketId,
  }: {
    userId: string;
    socketId: string;
  }) {
    await redis.hset(this.SOCKET_USER_MAP, socketId, userId);
    await redis.hset(this.USER_SOCKET_MAP, userId, socketId);
  }

  async delSocketId({ userId }: { userId: string }) {
    await redis.hdel(this.USER_SOCKET_MAP, userId);
  }

  async delUserId({ socketId }: { socketId: string }) {
    await redis.hdel(this.SOCKET_USER_MAP, socketId);
  }

  //  to get all the users in a room
  async getUsersInRoom(room: string): Promise<string[]> {
    return await redis.smembers(`room:${room}:users`);
  }

  //  to get online user related to the user
  async getOnlineUsers(server: Server, rooms: string[]): Promise<string[]> {
    const userIds = new Set<string>();

    for (const room of rooms) {
      const sockets = server.sockets.adapter.rooms.get(room);
      if (!sockets) continue;

      for (const socketId of sockets) {
        const userId = await this.getUserId({ socketId });
        if (userId) userIds.add(userId);
      }
    }

    return Array.from(userIds);
  }

  async getUserAllRooms({ userId }: { userId: string }) {
    return await redis.smembers(`user:${userId}:rooms`);
  }
  async upsertUserRoom({ userId, room }: { userId: string; room: string }) {
    await redis.sadd(`user:${userId}:rooms`, room);
  }
  async delUserRoom({ userId, room }: { userId: string; room: string }) {
    await redis.srem(`user:${userId}:rooms`, room);
  }

  // to get active chatroom user part of
  async addUserToRoom({ userId, room }: { userId: string; room: string }) {
    await Promise.all([
      redis.set(`user:${userId}:active-room`, room),
      redis.sadd(`room:${room}:users`, userId),
    ]);
  }
  async removeUserFromRoom({ userId, room }: { userId: string; room: string }) {
    await Promise.all([
      redis.del(`user:${userId}:active-room`, room),
      redis.srem(`room:${room}:users`, userId),
    ]);
  }
  async delUserActiveRoom({ userId }: { userId: string }) {
    const room = await redis.get(`user:${userId}:active-room`);
    const pipeline = redis.multi();
    pipeline.del(`user:${userId}:active-room`);
    pipeline.srem(`room:${room}:users`, userId);
    await pipeline.exec();
  }
  async getUserActiveRoom({ userId }: { userId: string }) {
    return await redis.smembers(`user:${userId}:active-room`);
  }
}
