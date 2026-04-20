import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { SOCKET_EVENTS } from '@yapper/types';

import type {
  JOIN_SOCKET_PAYLOAD,
  LEAVECHAT_SOCKET_PAYLOAD,
  STOP_TYPING_SOCKET_PAYLOAD,
  TYPING_SOCKET_PAYLOAD,
} from '@yapper/types';
import { Server } from 'socket.io';
import { CommonService } from './common.service';

@WebSocketGateway()
export class CommonGateway {
  @WebSocketServer()
  server!: Server;

  constructor(private readonly service: CommonService) {}

  @SubscribeMessage(SOCKET_EVENTS.COMMON.JOIN)
  async handleJoinMessage(client: any, payload: JOIN_SOCKET_PAYLOAD) {
    const { chatroomId } = payload;
    this.server.to(chatroomId).emit(SOCKET_EVENTS.COMMON.JOIN_CLIENT, payload);
    await this.service.joinChatroom(payload);
    return { status: 'ok' };
  }

  @SubscribeMessage(SOCKET_EVENTS.COMMON.LEAVE)
  async handleLeaveMessage(client: any, payload: LEAVECHAT_SOCKET_PAYLOAD) {
    const { chatroomId } = payload;
    this.server.to(chatroomId).emit(SOCKET_EVENTS.COMMON.LEAVE_CLIENT, payload);
    await this.service.leaveChatroom(payload);
    return { status: 'ok' };
  }

  @SubscribeMessage(SOCKET_EVENTS.COMMON.TYPING)
  async handleTyping(client: any, payload: TYPING_SOCKET_PAYLOAD) {
    const { chatroomId } = payload;
    this.server
      .to(chatroomId)
      .emit(SOCKET_EVENTS.COMMON.TYPING_CLIENT, payload);
    return { status: 'ok' };
  }

  @SubscribeMessage(SOCKET_EVENTS.COMMON.STOP_TYPING)
  async handleStopTyping(client: any, payload: STOP_TYPING_SOCKET_PAYLOAD) {
    const { chatroomId } = payload;
    this.server
      .to(chatroomId)
      .emit(SOCKET_EVENTS.COMMON.STOP_TYPING_CLIENT, payload);
    return { status: 'ok' };
  }
}
