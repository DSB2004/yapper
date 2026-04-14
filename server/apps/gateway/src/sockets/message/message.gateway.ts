import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { SOCKET_EVENTS } from '@yapper/types';
import { MessageService } from './message.service';
import { Server } from 'socket.io';

@WebSocketGateway()
export class MessageGateway {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(MessageGateway.name);

  constructor(private readonly messageService: MessageService) {}

  @SubscribeMessage(SOCKET_EVENTS.MESSAGE.ADD)
  async handleAddMessage(client: any, payload: any) {
    try {
      await this.messageService.addMessage(payload);
      const { chatroomId } = payload;
      this.server
        .to(chatroomId)
        .emit(SOCKET_EVENTS.MESSAGE.ADD_CLIENT, payload);
      return { status: 'ok' };
    } catch (err) {
      this.logger.error('Socket ADD failed', err);
      return { status: 'error' };
    }
  }

  @SubscribeMessage(SOCKET_EVENTS.MESSAGE.UPDATE)
  async handleUpdateMessage(client: any, payload: any) {
    try {
      await this.messageService.updateMessage(payload);
      const { chatroomId } = payload;
      this.server
        .to(chatroomId)
        .emit(SOCKET_EVENTS.MESSAGE.UPDATE_CLIENT, payload);
      return { status: 'ok' };
    } catch (err) {
      this.logger.error('Socket UPDATE failed', err);
      return { status: 'error' };
    }
  }

  @SubscribeMessage(SOCKET_EVENTS.MESSAGE.DELETE)
  async handleDeleteMessage(client: any, payload: any) {
    try {
      await this.messageService.deleteMessage(payload);
      const { chatroomId } = payload;
      this.server
        .to(chatroomId)
        .emit(SOCKET_EVENTS.MESSAGE.DELETE_CLIENT, payload);
      return { status: 'ok' };
    } catch (err) {
      this.logger.error('Socket DELETE failed', err);
      return { status: 'error' };
    }
  }

  @SubscribeMessage(SOCKET_EVENTS.MESSAGE.PIN)
  async handlePinnedMessage(client: any, payload: any) {
    try {
      await this.messageService.pinMessage(payload);
      const { chatroomId } = payload;
      this.server
        .to(chatroomId)
        .emit(SOCKET_EVENTS.MESSAGE.PIN_CLIENT, payload);
      return { status: 'ok' };
    } catch (err) {
      this.logger.error('Socket PIN failed', err);
      return { status: 'error' };
    }
  }

  @SubscribeMessage(SOCKET_EVENTS.MESSAGE.STAR)
  async handleStarMessage(client: any, payload: any) {
    try {
      await this.messageService.starMessage(payload);
      const { chatroomId } = payload;
      this.server
        .to(chatroomId)
        .emit(SOCKET_EVENTS.MESSAGE.STAR_CLIENT, payload);
      return { status: 'ok' };
    } catch (err) {
      this.logger.error('Socket STAR failed', err);
      return { status: 'error' };
    }
  }

  @SubscribeMessage(SOCKET_EVENTS.MESSAGE.REACTION)
  async handleReactionMessage(client: any, payload: any) {
    try {
      await this.messageService.reactionMessage(payload);
      const { chatroomId } = payload;
      this.server
        .to(chatroomId)
        .emit(SOCKET_EVENTS.MESSAGE.REACTION_CLIENT, payload);
      return { status: 'ok' };
    } catch (err) {
      this.logger.error('Socket REACTION failed', err);
      return { status: 'error' };
    }
  }

  @SubscribeMessage(SOCKET_EVENTS.MESSAGE.SEEN)
  async handleSeenMessage(client: any, payload: any) {
    try {
      await this.messageService.seenMessage(payload);
      const { chatroomId } = payload;
      this.server
        .to(chatroomId)
        .emit(SOCKET_EVENTS.MESSAGE.SEEN_CLIENT, payload);
      return { status: 'ok' };
    } catch (err) {
      this.logger.error('Socket SEEN failed', err);
      return { status: 'error' };
    }
  }

  @SubscribeMessage(SOCKET_EVENTS.MESSAGE.RECEIVED)
  async handleReceivedMessage(client: any, payload: any) {
    try {
      await this.messageService.receivedMessage(payload);
      const { chatroomId } = payload;
      this.server
        .to(chatroomId)
        .emit(SOCKET_EVENTS.MESSAGE.RECEIVED_CLIENT, payload);
      return { status: 'ok' };
    } catch (err) {
      this.logger.error('Socket RECEIVED failed', err);
      return { status: 'error' };
    }
  }
}
