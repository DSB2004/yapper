import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/rpc/auth/auth.service';
import { ChatroomService } from 'src/rpc/chatroom/chatroom.service';
import { UserService } from 'src/rpc/user/user.service';
import { Sockets } from './sockets';

import {
  ONLINE_SOCKET_PAYLOAD,
  OFFLINE_SOCKET_PAYLOAD,
  SOCKET_EVENTS,
} from '@yapper/types';

@WebSocketGateway()
export class SocketsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;
  constructor(
    private readonly auth: AuthService,
    private readonly user: UserService,
    private readonly chatroom: ChatroomService,
    private readonly socket: Sockets,
  ) {}
  async handleConnection(client: Socket) {
    const { 'access-token': accessToken, 'refresh-token': refreshToken } =
      client.handshake.auth;
    if (!refreshToken || typeof refreshToken !== 'string') {
      console.log('tokens are missing');
      client.disconnect(true);
      return;
    }
    const { authId } = await this.auth.validateUser({
      accessToken: (accessToken as string) ?? '',
      refreshToken,
    });

    if (!authId) {
      console.log('failed to validate user');
      client.disconnect(true);
      return;
    }
    const user = await this.user.getUser({ authId });
    if (!user) {
      console.log('user details not found');
      client.disconnect(true);
      return;
    }

    const activeConnection = await this.socket.getSocketId({
      userId: user.userId,
    });
    if (activeConnection) {
      client.disconnect(true);
      return;
    }

    // const userId = client.handshake.headers['user'] as string;

    // console.log(userId);
    // const user = {
    //   userId,
    // };

    const chatrooms = await this.chatroom.getChatroomIds({
      userId: user.userId,
    });

    console.log(chatrooms);
    const chatroomMap = new Map<string, string[]>();
    for (let chatroom of chatrooms.chatrooms) {
      client.join(chatroom);
      client.to(chatroom).emit(SOCKET_EVENTS.COMMON.ONLINE_CLIENT, {
        userId: user.userId,
      } as ONLINE_SOCKET_PAYLOAD);
      await this.socket.upsertUserRoom({ userId: user.userId, room: chatroom });
      const userInRoom = await this.socket.getUsersInRoom(chatroom);
      chatroomMap.set(chatroom, userInRoom);
    }

    const onlineUsers = await this.socket.getOnlineUsers(
      this.server,
      chatrooms.chatrooms,
    );
    await this.socket.setSocketId({ userId: user.userId, socketId: client.id });
    const payload = {
      onlineUsers,
      inChat: Object.fromEntries(chatroomMap),
    };
    client.emit(SOCKET_EVENTS.COMMON.DETAILS_CLIENT, payload);
    console.log('Client connected:', client.id, user.userId);
  }

  async handleDisconnect(client: Socket) {
    // offline status update
    const userId = await this.socket.getUserId({ socketId: client.id });
    await this.socket.delUserId({ socketId: client.id });
    if (userId) {
      const rooms = await this.socket.getUserAllRooms({ userId });
      console.log(userId, rooms);
      for (let room of rooms) {
        console.log(room);
        client.to(room).emit(SOCKET_EVENTS.COMMON.OFFLINE_CLIENT, {
          userId,
        } as OFFLINE_SOCKET_PAYLOAD);
        await this.socket.delUserRoom({ userId, room });
      }
      await this.socket.delUserActiveRoom({ userId });
      await this.socket.delSocketId({ userId });
    }
    console.log('Client disconnected:', client.id);
  }
}
