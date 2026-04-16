import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  ADD_MESSAGE_SOCKET_PAYLOAD,
  DELETE_MESSAGE_SOCKET_PAYLOAD,
  UPDATE_MESSAGE_SOCKET_PAYLOAD,
} from '@yapper/types';
import { Model } from 'mongoose';
import { Chatroom } from 'src/model/chatroom';

@Injectable()
export class MessageService {
  private readonly logger = new Logger(MessageService.name);

  constructor(
    @InjectModel(Chatroom.name)
    private readonly chatroomRepo: Model<Chatroom>,
  ) {}
  async addMessage({
    chatroomId,
    message,
    by,
    createdAt,
  }: ADD_MESSAGE_SOCKET_PAYLOAD) {
    const { attachments = [], publicId, text } = message;
    const messageCreatedAt = createdAt ?? new Date();
    try {
      // generate preview text
      let previewText = '';

      if (text) {
        previewText = text;
      } else if (attachments.length) {
        const file = attachments[0]?.filename || '';

        if (/\.(jpg|jpeg|png|webp)$/i.test(file)) {
          previewText = 'Photo';
        } else if (/\.(mp4|mov|avi)$/i.test(file)) {
          previewText = 'Video';
        } else {
          previewText = `${attachments.length} file(s)`;
        }
      }

      await this.chatroomRepo.updateOne(
        {
          publicId: chatroomId,
          $or: [
            { 'lastMessage.createdAt': { $lt: messageCreatedAt } },
            { lastMessage: { $exists: false } },
          ],
        },
        {
          $set: {
            lastMessage: {
              publicId,
              text,
              by,
              createdAt: messageCreatedAt,
              previewText,
            },
          },
        },
      );
    } catch (err) {
      this.logger.error('Failed to persist ADD message', err);
    }
  }
  async updateMessage({
    chatroomId,
    message,
    messageId,
  }: UPDATE_MESSAGE_SOCKET_PAYLOAD) {
    const { text } = message;

    try {
      const previewText = text?.trim() ? text : 'Message updated';

      await this.chatroomRepo.updateOne(
        { publicId: chatroomId, 'lastMessage.publicId': messageId },
        {
          $set: {
            'lastMessage.text': text,
            'lastMessage.previewText': previewText,
          },
        },
      );
    } catch (err) {
      this.logger.error('Failed to persist ADD message', err);
    }
  }

  async deleteMessage({
    chatroomId,
    messageId,
  }: DELETE_MESSAGE_SOCKET_PAYLOAD) {
    try {
      let previewText = 'This message has been deleted';

      await this.chatroomRepo.updateOne(
        { publicId: chatroomId, 'lastMessage.publicId': messageId },
        {
          $set: {
            'lastMessage.text': '',
            'lastMessage.previewText': previewText,
          },
        },
      );
    } catch (err) {
      this.logger.error('Failed to persist ADD message', err);
    }
  }
}
