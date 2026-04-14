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

  // to get rooms joined by user
  async addUserToRoom({ userId, room }: { userId: string; room: string }) {
    await Promise.all([
      redis.sadd(`user:${userId}:rooms`, room),
      redis.sadd(`room:${room}:users`, userId),
    ]);
  }
  async removeUserFromRoom({ userId, room }: { userId: string; room: string }) {
    await Promise.all([
      redis.srem(`user:${userId}:rooms`, room),
      redis.srem(`room:${room}:users`, userId),
    ]);
  }
  async delUserRooms({ userId }: { userId: string }) {
    const rooms = await redis.smembers(`user:${userId}:rooms`);

    const pipeline = redis.multi();

    for (const room of rooms) {
      pipeline.srem(`room:${room}:users`, userId);
    }

    pipeline.del(`user:${userId}:rooms`);

    await pipeline.exec();
  }
  async getUserRooms({ userId }: { userId: string }) {
    return await redis.smembers(`user:${userId}:rooms`);
  }
}
