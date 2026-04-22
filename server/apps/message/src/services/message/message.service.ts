import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  ADD_MESSAGE_SOCKET_PAYLOAD,
  UPDATE_MESSAGE_SOCKET_PAYLOAD,
  DELETE_MESSAGE_SOCKET_PAYLOAD,
  PINNED_MESSAGE_SOCKET_PAYLOAD,
  STARRED_MESSAGE_SOCKET_PAYLOAD,
  REACTION_MESSAGE_SOCKET_PAYLOAD,
  SEEN_MESSAGE_SOCKET_PAYLOAD,
  RECEIVED_MESSAGE_SOCKET_PAYLOAD,
  GetUnreadCountRequest,
  GetUnreadCountResponse,
  BLOCK_STATUS_UPDATE,
} from '@yapper/types';
import { Model } from 'mongoose';
import { Message } from 'src/models/message';
import { GetMessageRequest, GetMessageResponse } from '@yapper/types';
import { generateCuid } from '@yapper/utils';
@Injectable()
export class MessageService {
  private readonly logger = new Logger(MessageService.name);

  constructor(
    @InjectModel(Message.name)
    private readonly messageRepo: Model<Message>,
  ) {}
  async getMessages(payload: GetMessageRequest): Promise<GetMessageResponse> {
    try {
      const messages = await this.messageRepo.find({
        chatroomId: payload.chatroom,
        for: { $in: [payload.userId] },
      });
      return {
        message: 'Messages for chatroom',
        success: true,
        status: 200,
        data: (messages as any) ?? [],
      };
    } catch (err) {
      this.logger.error('Failed to GET message', err);
      return {
        message: 'Failed to get message',
        success: false,
        status: 500,
        data: [],
      };
    }
  }

  async getUnreadCountMessages(
    payload: GetUnreadCountRequest,
  ): Promise<GetUnreadCountResponse> {
    try {
      const unreadCount = await this.messageRepo.countDocuments({
        chatroomId: payload.chatroom,
        for: payload.userId,
        seen: { $ne: payload.userId },
        by: { $ne: payload.userId },
      });
      return {
        message: 'Unread message count',
        success: true,
        status: 200,
        unreadCount,
      };
    } catch (err) {
      this.logger.error('Failed to GET message', err);
      return {
        message: 'Failed to get unread message count',
        success: false,
        status: 500,
        unreadCount: 0,
      };
    }
  }
  async addMessage(payload: ADD_MESSAGE_SOCKET_PAYLOAD) {
    try {
      await this.messageRepo.create({
        publicId: payload.message.publicId,
        chatroomId: payload.chatroomId,
        by: payload.by,
        isReply: payload.message.isReply,
        replyFor: payload.message.replyFor,
        isForwarded: payload.message.isForwarded,
        text: payload.message.text,
        type: payload.message.type,
        attachments: payload.message.attachments,
        createdAt: payload.createdAt,
        for: payload.message.for,
      });
    } catch (err) {
      this.logger.error('Failed to persist ADD message', err);
    }
  }

  async updateMessage(payload: UPDATE_MESSAGE_SOCKET_PAYLOAD) {
    try {
      const message = await this.messageRepo.findOne({
        publicId: payload.messageId,
      });
      if (!message) {
        this.logger.warn('Failed to persist UPDATE message, message not found');
        return;
      }
      await this.messageRepo.updateOne(
        { publicId: payload.messageId, chatroomId: payload.chatroomId },
        { text: payload.message.text, isUpdated: true },
      );
    } catch (err) {
      this.logger.error('Failed to persist UPDATE message', err);
    }
  }

  async deleteMessage(payload: DELETE_MESSAGE_SOCKET_PAYLOAD) {
    try {
      const message = await this.messageRepo.findOne({
        publicId: payload.messageId,
      });
      if (!message) {
        this.logger.warn('Failed to persist PIN message, message not found');
        return;
      }
      await this.messageRepo.updateOne(
        {
          publicId: payload.messageId,
          chatroomId: payload.chatroomId,
        },
        {
          text: '',
          attachments: [],
          reactions: [],
          isDeleted: true,
        },
      );
    } catch (err) {
      this.logger.error('Failed to persist DELETE message', err);
    }
  }

  async pinMessage(payload: PINNED_MESSAGE_SOCKET_PAYLOAD) {
    try {
      const message = await this.messageRepo.findOne({
        publicId: payload.messageId,
      });
      if (!message) {
        this.logger.warn('Failed to persist PIN message, message not found');
        return;
      }
      await this.messageRepo.updateOne(
        { publicId: payload.messageId, chatroomId: payload.chatroomId },
        { isPinned: !message.isPinned },
      );
      await this.messageRepo.create({
        publicId: generateCuid('info'),
        chatroomId: payload.chatroomId,
        by: payload.pinnedBy,
        isReply: false,
        isForwarded: false,
        text: message.isPinned ? 'UNPINNED' : 'PINNED',
        type: 'INFO',
        attachments: [],
        createdAt: Date.now(),
        for: payload.for,
      });
    } catch (err) {
      this.logger.error('Failed to persist PIN message', err);
    }
  }

  async starMessage(payload: STARRED_MESSAGE_SOCKET_PAYLOAD) {
    try {
      const message = await this.messageRepo.findOne({
        publicId: payload.messageId,
      });
      if (!message) {
        this.logger.warn('Failed to persist STAR message, message not found');
        return;
      }
      await this.messageRepo.updateOne(
        { publicId: payload.messageId, chatroomId: payload.chatroomId },
        { isStarred: !message.isStarred },
      );
    } catch (err) {
      this.logger.error('Failed to persist STAR message', err);
    }
  }

  async reactionMessage(payload: REACTION_MESSAGE_SOCKET_PAYLOAD) {
    try {
      const message = await this.messageRepo.findOne({
        publicId: payload.messageId,
      });

      if (!message) {
        this.logger.warn('Message not found');
        return;
      }

      let reactions = message.reactions || [];

      const existingIndex = reactions.findIndex(
        (r) => r.userId === payload.reactionBy,
      );

      if (existingIndex !== -1) {
        reactions[existingIndex].reaction = payload.reaction;
      } else {
        reactions.push({
          userId: payload.reactionBy,
          reaction: payload.reaction,
        });
      }

      await this.messageRepo.updateOne(
        { publicId: payload.messageId },
        { reactions },
      );
    } catch (err) {
      this.logger.error('Failed to persist REACTION message', err);
    }
  }

  async seenMessage(payload: SEEN_MESSAGE_SOCKET_PAYLOAD) {
    try {
      await this.messageRepo.updateOne(
        { publicId: payload.messageId },
        {
          $addToSet: {
            seen: payload.seenBy,
          },
        },
      );
      console.log('[MESSAGE][SEEN]', payload.seenBy, payload.messageId);
    } catch (err) {
      this.logger.error('Failed to persist SEEN message', err);
    }
  }

  async receivedMessage(payload: RECEIVED_MESSAGE_SOCKET_PAYLOAD) {
    try {
      await this.messageRepo.updateOne(
        { publicId: payload.messageId },
        {
          $addToSet: {
            received: payload.receivedBy,
          },
        },
      );
    } catch (err) {
      this.logger.error('Failed to persist RECEIVED message', err);
    }
  }

  async blockUserMessage(payload: BLOCK_STATUS_UPDATE) {
    try {
      await this.messageRepo.create({
        publicId: generateCuid('info'),
        chatroomId: payload.chatroomId,
        by: payload.userId,
        isReply: false,
        isForwarded: false,
        text: 'BLOCK',
        type: 'INFO',
        attachments: [],
        createdAt: Date.now(),
        for: [payload.userId],
      });
    } catch (err) {
      this.logger.error('Failed to persist BLOCK message', err);
    }
  }
  async unBlockUserMessage(payload: BLOCK_STATUS_UPDATE) {
    try {
      await this.messageRepo.create({
        publicId: generateCuid('info'),
        chatroomId: payload.chatroomId,
        by: payload.userId,
        isReply: false,
        isForwarded: false,
        text: 'UNBLOCK',
        type: 'INFO',
        attachments: [],
        createdAt: Date.now(),
        for: [payload.userId],
      });
    } catch (err) {
      this.logger.error('Failed to persist UNBLOCK message', err);
    }
  }
}
