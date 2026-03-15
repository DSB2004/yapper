import { Injectable } from '@nestjs/common';
import {
  CreateChatroomRequest,
  CreateChatroomResponse,
  GetChatroomRequest,
  GetChatroomResponse,
  GetChatroomsRequest,
  GetChatroomsResponse,
  UserDetails,
} from '@yapper/types';
import { generateCuid } from '@yapper/utils';
import { ChatroomModel } from 'src/model/chatroom';
import { UserService } from 'src/rpc/user/user.service';

@Injectable()
export class ChatroomService {
  constructor(private readonly user: UserService) {}
  async getChatroom(payload: GetChatroomRequest): Promise<GetChatroomResponse> {
    try {
      const chatroom = await ChatroomModel.findOne({
        publicId: payload.chatroomId,
      });

      if (!chatroom) {
        return {
          chatroomId: '',
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
        chatroomId: chatroom.publicId,
        participants,
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
        chatroomId: '',
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
        message: 'Internal Server Error',
      };
    }
  }

  async getChatrooms(
    payload: GetChatroomsRequest,
  ): Promise<GetChatroomsResponse> {
    try {
      const chatrooms = await ChatroomModel.find({
        participants: payload.userId,
      }).lean();

      if (!chatrooms || chatrooms.length === 0) {
        return {
          chats: [],
          success: false,
          message: 'Chatroom not found',
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
          createdBy: participantsMap[chatroom.createdBy],
          ...(chatroom.updatedBy
            ? {
                updatedBy: participantsMap[chatroom.updatedBy],
              }
            : {}),
          createdAt: chatroom.createdAt.toISOString() ?? '',
          updatedAt: chatroom.updatedAt?.toISOString() ?? '',
          participants: chatroom.participants.map(
            (ele) => participantsMap[ele],
          ),
        };
      });
      return {
        chats,
        success: true,
        message: 'Chatroom Info Found',
      };
    } catch (err) {
      return {
        chats: [],
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
      await ChatroomModel.create({
        publicId,
        ...payload,
      });

      return {
        chatroomId: publicId,
        success: true,
        message: 'Chatroom created',
      };
    } catch (err) {
      return {
        chatroomId: '',
        success: false,
        message: 'Internal Server Error',
      };
    }
  }
}
