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
      client.handshake.headers;
    if (!refreshToken || typeof refreshToken !== 'string') {
      client.disconnect(true);
      return;
    }
    const { authId } = await this.auth.validateUser({
      accessToken: (accessToken as string) ?? '',
      refreshToken,
    });

    if (!authId) {
      client.disconnect(true);
      return;
    }
    const user = await this.user.getUser({ authId });
    if (!user) {
      client.disconnect(true);
      return;
    }

    const chatrooms = await this.chatroom.getChatroomIds({
      userId: user.userId,
    });

    const chatroomMap = new Map<string, string[]>();
    for (let chatroom of chatrooms.chatrooms) {
      client.join(chatroom);
      client.to(chatroom).emit(SOCKET_EVENTS.COMMON.ONLINE_CLIENT, {
        userId: user.userId,
      } as ONLINE_SOCKET_PAYLOAD);
      await this.socket.addUserToRoom({ userId: user.userId, room: chatroom });
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
      const rooms = await this.socket.getUserRooms({ userId });
      for (let room of rooms) {
        client.to(room).emit(SOCKET_EVENTS.COMMON.OFFLINE_CLIENT, {
          userId,
        } as OFFLINE_SOCKET_PAYLOAD);
      }

      await this.socket.delUserRooms({ userId });
      await this.socket.delSocketId({ userId });
    }
    console.log('Client disconnected:', client.id);
  }
}
