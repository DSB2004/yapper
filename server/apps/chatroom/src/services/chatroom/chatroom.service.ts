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
  GetChatroomSummaryRequest,
  GetChatroomSummaryResponse,
  LastMessage,
  UserDetails,
} from '@yapper/types';
import { generateCuid } from '@yapper/utils';
import { LRUCache } from 'lru-cache/raw';
import { Model } from 'mongoose';
import { Chatroom } from 'src/model/chatroom';
import { UserService } from 'src/rpc/user/user.service';
import { CHATROOM_CACHE } from './chatroom';
import { MessageService } from 'src/rpc/message/message.service';
import { GatewayService } from 'src/rpc/gateway/gateway.service';
@Injectable()
export class ChatroomService {
  constructor(
    private readonly user: UserService,
    private readonly message: MessageService,
    private readonly gateway: GatewayService,
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
      const chats = await Promise.all(
        chatrooms.map(async (chatroom) => {
          const unreadCountRes = await this.message.getUnreadCount({
            chatroom: chatroom.publicId,
            userId: payload.userId,
          });
          let isBlocked = false;
          let areYouBlocked = false;
          if (chatroom.type === 'PERSONAL') {
            const contact = chatroom.participants.find(
              (ele) => ele !== payload.userId,
            );
            if (contact) {
              isBlocked = (
                await this.user.checkBlockStatus({
                  userId: payload.userId,
                  contactId: contact,
                })
              ).isBlocked;

              areYouBlocked = (
                await this.user.checkBlockStatus({
                  userId: contact,
                  contactId: payload.userId,
                })
              ).isBlocked;
            }
          }

          return {
            isBlocked,
            areYouBlocked,
            chatroomId: chatroom.publicId,
            type: chatroom.type,
            isActive: chatroom.isActive,
            referenceId: chatroom.referenceId,
            name: chatroom.name,
            icon: chatroom.icon,
            createdBy: participantsMap.get(chatroom.createdBy),
            lastMessage: chatroom.lastMessage as unknown as LastMessage,

            ...(chatroom.updatedBy
              ? {
                  updatedBy: participantsMap.get(chatroom.updatedBy),
                }
              : {}),
            unreadCount: unreadCountRes.unreadCount,
            createdAt: chatroom.createdAt.toISOString(),
            updatedAt: chatroom.updatedAt?.toISOString() ?? '',

            participants: chatroom.participants
              .map((ele) => participantsMap.get(ele))
              .filter((ele) => !!ele),
          };
        }),
      );
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

  async getChatroomSummary(
    payload: GetChatroomSummaryRequest,
  ): Promise<GetChatroomSummaryResponse> {
    try {
      const chatroom = await this.chatroomModel
        .findOne({ publicId: payload.chatroomId })
        .lean();

      if (!chatroom) {
        return {
          status: 404,
          message: 'Chatroom not found',
          success: false,
        };
      }

      const usersRes = await this.user.getUsers({
        userIds: chatroom.participants,
      });

      const participantsMap = new Map<string, UserDetails>();
      usersRes.users.forEach((user) => {
        participantsMap.set(user.userId, user);
      });

      const unreadCountRes = await this.message.getUnreadCount({
        chatroom: chatroom.publicId,
        userId: payload.userId,
      });
      let isBlocked = false;
      let areYouBlocked = false;
      if (chatroom.type === 'PERSONAL') {
        const contact = chatroom.participants.find(
          (ele) => ele !== payload.userId,
        );
        if (contact) {
          isBlocked = (
            await this.user.checkBlockStatus({
              userId: payload.userId,
              contactId: contact,
            })
          ).isBlocked;

          areYouBlocked = (
            await this.user.checkBlockStatus({
              userId: contact,
              contactId: payload.userId,
            })
          ).isBlocked;
        }
      }

      const chatSummary = {
        isBlocked,
        areYouBlocked,
        chatroomId: chatroom.publicId,
        type: chatroom.type,
        isActive: chatroom.isActive,
        referenceId: chatroom.referenceId,
        name: chatroom.name,
        icon: chatroom.icon,

        createdBy: participantsMap.get(chatroom.createdBy),

        lastMessage: chatroom.lastMessage as unknown as LastMessage,

        ...(chatroom.updatedBy && {
          updatedBy: participantsMap.get(chatroom.updatedBy),
        }),

        unreadCount: unreadCountRes.unreadCount,

        createdAt: chatroom.createdAt?.toISOString(),
        updatedAt: chatroom.updatedAt?.toISOString() ?? '',

        participants: chatroom.participants
          .map((id: string) => participantsMap.get(id))
          .filter((ele) => !!ele),
      };

      return {
        status: 200,
        chatroom: chatSummary,
        success: true,
        message: 'Chatroom Info Found',
      };
    } catch (err) {
      console.log(err);
      return {
        status: 500,
        success: false,
        message: 'Internal Server Error',
      };
    }
  }
  async getChatroomIds(
    payload: GetChatroomIdsRequest,
  ): Promise<GetChatroomIdsResponse> {
    try {
      const chatrooms = await this.chatroomModel
        .find({
          participants: payload.userId,
        })
        .lean();

      const result = await Promise.all(
        chatrooms.map(async (chatroom) => {
          let isBlocked = false;
          if (chatroom.type === 'PERSONAL') {
            const contact = chatroom.participants.find(
              (ele: string) => ele !== payload.userId,
            );

            if (contact) {
              const blockRes = await this.user.checkBlockStatus({
                userId: payload.userId,
                contactId: contact,
              });

              isBlocked = blockRes.isBlocked;
            }
          }

          return {
            chatroomId: chatroom.publicId,
            isBlocked,
          };
        }),
      );

      return {
        chatrooms: result,
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
      const chatroom = await this.chatroomModel.create({
        publicId,
        ...payload,
      });
      const participants = (
        await this.user.getUsers({
          userIds: [...new Set(chatroom.participants)],
        })
      ).users;
      const participantsMap = new Map<string, UserDetails>();
      participants.map((ele) => {
        participantsMap.set(ele.userId, ele);
      });
      try {
        await this.gateway.addUsersToChatroom({
          chatroom: chatroom.publicId,
          userIds: chatroom.participants,
        });
      } catch (err) {
        console.log('error while calling gateway grpc', err);
      }
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
