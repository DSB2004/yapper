import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  CreateChatroomRequest,
  CreateChatroomResponse,
  GetChatroomIdsRequest,
  GetChatroomIdsResponse,
  GetChatroomRequest,
  GetChatroomResponse,
  GetChatroomsRequest,
  GetChatroomsResponse,
  UserDetails,
} from '@yapper/types';
import { generateCuid } from '@yapper/utils';
import { LRUCache } from 'lru-cache/raw';
import { Model } from 'mongoose';
import { Chatroom } from 'src/model/chatroom';
import { UserService } from 'src/rpc/user/user.service';
import { CHATROOM_CACHE } from './chatroom';

@Injectable()
export class ChatroomService {
  constructor(
    private readonly user: UserService,
    @Inject(CHATROOM_CACHE)
    private readonly cache: LRUCache<string, any>,
    @InjectModel(Chatroom.name)
    private readonly chatroomModel: Model<Chatroom>,
  ) {}
  async getChatroom(payload: GetChatroomRequest): Promise<GetChatroomResponse> {
    try {
      const chatroom = await this.chatroomModel.findOne({
        publicId: payload.chatroomId,
      });

      if (!chatroom) {
        return {
          status: 404,
          chatroomId: '',
          referenceId: '',
          participants: [],
          createdAt: '',
          type: '',
          isActive: false,
          createdBy: {
            name: '',
            userId: '',
            avatar: '',
          },
          success: false,
          message: 'Chatroom not found',
        };
      }
      const participants = (
        await this.user.getUsers({
          userIds: chatroom.participants,
        })
      ).users;

      const participantsMap = new Map<string, UserDetails>();
      participants.map((ele) => {
        participantsMap.set(ele.userId, ele);
      });

      return {
        status: 200,
        chatroomId: chatroom.publicId,
        participants,
        referenceId: chatroom.referenceId,
        createdAt: chatroom.createdAt.toISOString() ?? '',
        updatedAt: chatroom.updatedAt?.toISOString() ?? '',
        type: chatroom.type,
        isActive: chatroom.isActive,
        createdBy: participantsMap[chatroom.createdBy],
        ...(chatroom.updatedBy
          ? {
              updatedBy: participantsMap[chatroom.updatedBy],
            }
          : {}),
        success: true,
        message: 'Chatroom Info Found',
      };
    } catch (err) {
      return {
        status: 500,
        chatroomId: '',
        participants: [],
        referenceId: '',
        createdAt: '',
        type: '',
        isActive: false,
        createdBy: {
          name: '',
          userId: '',
          avatar: '',
        },
        success: false,
        message: 'Internal Server Error',
      };
    }
  }

  async getChatrooms(
    payload: GetChatroomsRequest,
  ): Promise<GetChatroomsResponse> {
    try {
      const chatrooms = await this.chatroomModel
        .find({
          participants: payload.userId,
        })
        .lean();

      if (!chatrooms || chatrooms.length === 0) {
        return {
          status: 200,
          chats: [],
          success: true,
          message: 'No chats found',
        };
      }
      const participants = (
        await this.user.getUsers({
          userIds: [...new Set(chatrooms.flatMap((c) => c.participants))],
        })
      ).users;
      const participantsMap = new Map<string, UserDetails>();
      participants.map((ele) => {
        participantsMap.set(ele.userId, ele);
      });

      const chats = chatrooms.map((chatroom) => {
        return {
          chatroomId: chatroom.publicId,
          type: chatroom.type,
          isActive: chatroom.isActive,
          referenceId: chatroom.referenceId,
          name: chatroom.name,
          icon: chatroom.icon,
          createdBy: participantsMap.get(chatroom.createdBy),
          ...(chatroom.updatedBy
            ? {
                updatedBy: participantsMap.get(chatroom.updatedBy),
              }
            : {}),
          createdAt: chatroom.createdAt.toISOString() ?? '',
          updatedAt: chatroom.updatedAt?.toISOString() ?? '',
          participants: chatroom.participants
            .map((ele) => participantsMap.get(ele))
            .filter((ele) => !!ele),
        };
      });
      return {
        status: 200,
        chats,
        success: true,
        message: 'Chatroom Info Found',
      };
    } catch (err) {
      console.log(err);
      return {
        status: 500,
        chats: [],
        success: false,
        message: 'Internal Server Error',
      };
    }
  }

  async getChatroomIds(
    payload: GetChatroomIdsRequest,
  ): Promise<GetChatroomIdsResponse> {
    try {
      if (this.cache.get(payload.userId)) {
        const chatrooms = this.cache.get(payload.userId);
        return {
          chatrooms,
          success: true,
          message: 'Chatroom Info Found',
        };
      }
      const chatrooms = (
        await this.chatroomModel
          .find({
            participants: payload.userId,
          })
          .lean()
      ).map((chatroom) => chatroom.publicId);
      this.cache.set(payload.userId, chatrooms);
      return {
        chatrooms,
        success: true,
        message: 'Chatroom Info Found',
      };
    } catch (err) {
      console.log(err);
      return {
        chatrooms: [],
        success: false,
        message: 'Internal Server Error',
      };
    }
  }

  async createChatroom(
    payload: CreateChatroomRequest,
  ): Promise<CreateChatroomResponse> {
    try {
      const publicId = generateCuid('chatroom');
      await this.chatroomModel.create({
        publicId,
        ...payload,
      });

      return {
        status: 200,
        chatroomId: publicId,
        success: true,
        message: 'Chatroom created',
      };
    } catch (err) {
      console.error('Error creating chatroom', err);
      return {
        status: 500,
        chatroomId: '',
        success: false,
        message: 'Internal Server Error',
      };
    }
  }
}
