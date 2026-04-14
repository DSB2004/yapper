import { Injectable } from '@nestjs/common';
import { db } from 'src/lib/db';
import { generateCuid } from '@yapper/utils';

import {
  CreateGroupRequest,
  CreateGroupResponse,
  UpdateGroupRequest,
  UpdateGroupResponse,
  AddGroupMemberRequest,
  AddGroupMemberResponse,
  RemoveGroupMemberRequest,
  RemoveGroupMemberResponse,
  LeaveGroupRequest,
  LeaveGroupResponse,
  CHATROOM_TYPE,
} from '@yapper/types';
import { ChatroomService } from 'src/rpc/chatroom/chatroom.service';

@Injectable()
export class GroupService {
  constructor(private readonly chatroom: ChatroomService) {}
  async createGroup(payload: CreateGroupRequest): Promise<CreateGroupResponse> {
    try {
      const members = await db.user.findMany({
        where: {
          publicId: { in: payload.members },
        },
      });

      const users = members.filter((ele) => !!ele);
      const createdBy = await db.user.findUnique({
        where: { authId: payload.authId },
      });
      if (!createdBy) {
        return {
          status: 404,
          createdBy: '',
          chatroomId: '',
          message: 'CreatedBy not found',
          groupId: '',
          success: false,
        };
      }
      const publicId = generateCuid('group');

      const chatroomId = (
        await this.chatroom.createChatroom({
          createdBy: createdBy.publicId,
          participants: users.map((ele) => ele.publicId),
          name: payload.name,
          description: payload.description,
          icon: payload.icon,
          type: CHATROOM_TYPE.GROUP,
          referenceId: publicId,
        })
      ).chatroomId;
      if (!chatroomId)
        return {
          createdBy: '',
          status: 500,
          groupId: '',
          success: false,
          chatroomId: '',

          message: 'Failed to create new group! Chatroom not created',
        };

      const group = await db.group.create({
        data: {
          publicId,

          name: payload.name,
          description: payload.description,
          icon: payload.icon,

          chatroomId,

          admins: {
            connect: [{ id: createdBy.id }],
          },

          participants: {
            connect: users.map((u) => ({ id: u!.id })),
          },

          createdById: createdBy.id,
          updatedById: createdBy.id,
        },
      });

      return {
        status: 200,
        createdBy: createdBy.publicId,
        groupId: group.publicId,
        success: true,
        message: 'Group created',
        chatroomId,
      };
    } catch (err) {
      console.log(err);
      return {
        createdBy: '',

        success: false,
        groupId: '',
        status: 500,
        message: 'Failed to create group',
        chatroomId: '',
      };
    }
  }
  async updateGroup(payload: UpdateGroupRequest): Promise<UpdateGroupResponse> {
    try {
      const user = await db.user.findUnique({
        where: {
          authId: payload.authId,
        },
      });
      if (!user) {
        return {
          status: 404,
          success: false,
          message: 'User not found',
        };
      }
      const admin = await db.group.findUnique({
        where: {
          publicId: payload.groupId,
          admins: { some: { id: user.id } },
        },
      });
      if (!admin) {
        return {
          status: 403,
          success: false,
          message: 'Need admin access',
        };
      }
      await db.group.update({
        where: {
          publicId: payload.groupId,
        },
        data: {
          name: payload.name,
          description: payload.description,
          icon: payload.icon,
          updatedById: admin.id,
        },
      });

      return {
        status: 200,
        success: true,
        message: 'Group updated',
      };
    } catch (err) {
      return {
        status: 500,
        success: false,
        message: 'Failed to update group',
      };
    }
  }

  async addGroupMember(
    payload: AddGroupMemberRequest,
  ): Promise<AddGroupMemberResponse> {
    try {
      const user = await db.user.findUnique({
        where: {
          authId: payload.authId,
        },
      });
      if (!user) {
        return {
          status: 404,
          success: false,
          message: 'User not found',
        };
      }
      const isAdmin = await db.group.findUnique({
        where: {
          publicId: payload.groupId,
          admins: { some: { id: user.id } },
        },
      });
      if (!isAdmin) {
        return {
          status: 403,
          success: false,
          message: 'Need admin access',
        };
      }

      const contacts = await db.user.findMany({
        where: {
          publicId: { in: payload.members },
        },
      });

      const users = contacts.filter((ele) => !!ele);

      await db.group.update({
        where: { publicId: payload.groupId },
        data: {
          participants: {
            connect: users.map((u) => ({ id: u!.id })),
          },
        },
      });

      return {
        status: 200,
        success: true,
        message: 'Members added',
      };
    } catch (err) {
      return {
        status: 500,
        success: false,
        message: 'Failed to add member',
      };
    }
  }

  async removeGroupMember(
    payload: RemoveGroupMemberRequest,
  ): Promise<RemoveGroupMemberResponse> {
    try {
      const user = await db.user.findUnique({
        where: {
          authId: payload.authId,
        },
      });
      if (!user) {
        return {
          status: 404,
          success: false,
          message: 'User not found',
        };
      }
      const isAdmin = await db.group.findUnique({
        where: {
          publicId: payload.groupId,
          admins: { some: { id: user.id } },
        },
      });
      if (!isAdmin) {
        return {
          status: 403,
          success: false,
          message: 'Need admin access',
        };
      }
      const contacts = await db.user.findMany({
        where: {
          publicId: { in: payload.members },
        },
      });

      const users = contacts.filter((ele) => !!ele);

      await db.group.update({
        where: { publicId: payload.groupId },
        data: {
          participants: {
            disconnect: users.map((u) => ({ id: u!.id })),
          },
        },
      });

      return {
        status: 200,
        success: true,
        message: 'Members removed',
      };
    } catch (err) {
      return {
        status: 500,
        success: false,
        message: 'Failed to remove member',
      };
    }
  }

  async leaveGroup(payload: LeaveGroupRequest): Promise<LeaveGroupResponse> {
    try {
      const user = await db.user.findUnique({
        where: {
          authId: payload.authId,
        },
      });
      if (!user) {
        return {
          status: 404,
          success: false,
          message: 'User not found',
        };
      }
      await db.group.update({
        where: { publicId: payload.groupId },
        data: {
          participants: {
            disconnect: [{ id: user.id }],
          },
        },
      });

      return {
        status: 200,
        success: true,
        message: 'Group left',
      };
    } catch (err) {
      return {
        status: 500,
        success: false,
        message: 'Failed to leave group',
      };
    }
  }
}
