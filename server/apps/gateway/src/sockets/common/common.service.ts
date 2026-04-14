import { Injectable } from '@nestjs/common';
import { SocketsService } from '../sockets.service';
import { JOIN_SOCKET_PAYLOAD, LEAVECHAT_SOCKET_PAYLOAD } from '@yapper/types';
import { Sockets } from '../sockets';

@Injectable()
export class CommonService {
  constructor(
    private readonly socketProvider: SocketsService,
    private readonly socket: Sockets,
  ) {}

  async sendGroupUpdate({
    event,
    chatroom,
    payload,
  }: {
    event: string;
    chatroom: string;
    payload: any;
  }) {
    try {
      const socket = this.socketProvider.getServer();
      socket.to(chatroom).emit(event, payload);
    } catch (err: any) {
      console.error(err.message ?? 'Error sending update');
    }
  }

  async leaveChatroom({ userId, chatroomId }: LEAVECHAT_SOCKET_PAYLOAD) {
    await this.socket.removrUserFromRoom({ userId: userId, room: chatroomId });
  }
  async joinChatroom({ userId, chatroomId }: JOIN_SOCKET_PAYLOAD) {
    await this.socket.addUserToRoom({ userId: userId, room: chatroomId });
  }
}
