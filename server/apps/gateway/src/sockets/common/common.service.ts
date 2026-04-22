import { Injectable } from '@nestjs/common';
import { SocketsService } from '../sockets.service';
import {
  AddUsersToChatroomRequest,
  AddUsersToChatroomResponse,
  BLOCK_STATUS_UPDATE,
  InfoEvent,
  JOIN_SOCKET_PAYLOAD,
  LEAVECHAT_SOCKET_PAYLOAD,
  RemoveUsersFromChatroomRequest,
  RemoveUsersFromChatroomResponse,
  SOCKET_EVENTS,
} from '@yapper/types';
import { Sockets } from '../sockets';
import { ChatroomService } from 'src/rpc/chatroom/chatroom.service';
import { generateCuid } from '@yapper/utils';

@Injectable()
export class CommonService {
  constructor(
    private readonly socketProvider: SocketsService,
    private readonly socket: Sockets,
    private readonly chatroom: ChatroomService,
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

  async blockUser(payload: BLOCK_STATUS_UPDATE) {
    const { chatroomId, userId, contactId } = payload;
    const server = this.socketProvider.getServer();

    const socketId = await this.socket.getSocketId({ userId });
    if (socketId) {
      const socket = server.sockets.sockets.get(socketId);
      if (socket) {
        socket.emit(SOCKET_EVENTS.MESSAGE.ADD_CLIENT, {
          message: {
            publicId: generateCuid('msg'),
            type: 'INFO',
            attachments: [],
            text: InfoEvent.BLOCK,
            for: [userId],
            isReply: false,
            isForwarded: false,
          },
          chatroomId,
          by: userId,
          createdAt: new Date().toDateString(),
        });
        socket.leave(chatroomId);
      }
    }
    const contactSocketId = await this.socket.getSocketId({
      userId: contactId,
    });
    if (contactSocketId) {
      const contactSocket = server.sockets.sockets.get(contactSocketId);
      if (contactSocket) {
        contactSocket.emit(SOCKET_EVENTS.CONTACT.BLOCK_CLIENT, payload);
      }
    }
  }

  async unBlockUser(payload: BLOCK_STATUS_UPDATE) {
    const { chatroomId, userId, contactId } = payload;
    const server = this.socketProvider.getServer();

    const socketId = await this.socket.getSocketId({ userId });
    if (socketId) {
      const socket = server.sockets.sockets.get(socketId);
      if (socket) {
        socket.emit(SOCKET_EVENTS.MESSAGE.ADD_CLIENT, {
          message: {
            publicId: generateCuid('msg'),
            type: 'INFO',
            attachments: [],
            text: InfoEvent.UNBLOCK,
            for: [userId],
            isReply: false,
            isForwarded: false,
          },
          chatroomId,
          by: userId,
          createdAt: new Date().toDateString(),
        });
        socket.join(chatroomId);
      }
    }
    const contactSocketId = await this.socket.getSocketId({
      userId: contactId,
    });
    if (contactSocketId) {
      const contactSocket = server.sockets.sockets.get(contactSocketId);
      if (contactSocket) {
        contactSocket.emit(SOCKET_EVENTS.CONTACT.UNBLOCK_CLIENT, payload);
      }
    }
  }

  async addUsersToRoom({
    userIds,
    chatroom,
  }: AddUsersToChatroomRequest): Promise<AddUsersToChatroomResponse> {
    if (!chatroom) return { message: 'Chatroom is required' };
    const server = this.socketProvider.getServer();

    for (const userId of userIds) {
      const socketId = await this.socket.getSocketId({ userId });
      if (!socketId) continue; // user offline
      const socket = server.sockets.sockets.get(socketId);
      if (!socket) continue;
      socket.join(chatroom);
      const chatroomSummary = await this.chatroom.getChatroomSummary({
        userId,
        chatroomId: chatroom,
      });
      socket.emit(SOCKET_EVENTS.COMMON.NEW_CHATROOM_CLIENT, {
        chatroom: chatroomSummary.chatroom,
      });
    }
    return { message: 'Users added to chatroom' };
  }

  async removeUsersFromRoom({
    userIds,
    chatroom,
  }: RemoveUsersFromChatroomRequest): Promise<RemoveUsersFromChatroomResponse> {
    if (!chatroom) return { message: 'Chatroom is required' };
    const server = this.socketProvider.getServer();

    for (const userId of userIds) {
      const socketId = await this.socket.getSocketId({ userId });
      if (!socketId) continue; // user offline
      const socket = server.sockets.sockets.get(socketId);
      if (!socket) continue;
      socket.leave(chatroom);
    }

    return { message: 'Users added to chatroom' };
  }

  async leaveChatroom({ userId, chatroomId }: LEAVECHAT_SOCKET_PAYLOAD) {
    await this.socket.delUserRoom({ userId: userId, room: chatroomId });
    await this.socket.removeUserFromRoom({ userId: userId, room: chatroomId });
  }
  async joinChatroom({ userId, chatroomId }: JOIN_SOCKET_PAYLOAD) {
    await this.socket.upsertUserRoom({ userId: userId, room: chatroomId });
    await this.socket.addUserToRoom({ userId: userId, room: chatroomId });
  }
}
