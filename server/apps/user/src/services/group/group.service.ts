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
} from '@yapper/types';

@Injectable()
export class GroupService {
  async createGroup(payload: CreateGroupRequest): Promise<CreateGroupResponse> {
    try {
      const chatroomId = generateCuid('chatr');

      const members = await db.contact.findMany({
        where: {
          publicId: { in: payload.members.map((m) => m.contactId) },
        },
        include: {
          contact: true,
        },
      });

      const users = members.map((m) => m.contact).filter(Boolean);
      const createdBy = await db.user.findUnique({
        where: { publicId: payload.userId },
      });
      if (!createdBy) {
        return {
          message: 'CreatedBy not found',
          groupId: '',
          success: false,
        };
      }
      const group = await db.group.create({
        data: {
          publicId: generateCuid('group'),

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
        groupId: group.publicId,
        success: true,
        message: 'Group created',
      };
    } catch (err) {
      return {
        success: false,
        groupId: '',
        message: 'Failed to create group',
      };
    }
  }
  async updateGroup(payload: UpdateGroupRequest): Promise<UpdateGroupResponse> {
    try {
      const admin = await db.group.findUnique({
        where: {
          publicId: payload.groupId,
          admins: { some: { id: payload.userId } },
        },
      });
      if (!admin) {
        return {
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
        success: true,
        message: 'Group updated',
      };
    } catch (err) {
      return {
        success: false,
        message: 'Failed to update group',
      };
    }
  }

  async addGroupMember(
    payload: AddGroupMemberRequest,
  ): Promise<AddGroupMemberResponse> {
    try {
      const isAdmin = await db.group.findUnique({
        where: {
          publicId: payload.groupId,
          admins: { some: { id: payload.userId } },
        },
      });
      if (!isAdmin) {
        return {
          success: false,
          message: 'Need admin access',
        };
      }

      const contacts = await db.contact.findMany({
        where: {
          publicId: { in: payload.members.map((m) => m.contactId) },
        },
        include: { contact: true },
      });

      const users = contacts.map((c) => c.contact).filter(Boolean);

      await db.group.update({
        where: { publicId: payload.groupId },
        data: {
          participants: {
            connect: users.map((u) => ({ id: u!.id })),
          },
        },
      });

      return {
        success: true,
        message: 'Members added',
      };
    } catch (err) {
      return {
        success: false,
        message: 'Failed to add member',
      };
    }
  }

  async removeGroupMember(
    payload: RemoveGroupMemberRequest,
  ): Promise<RemoveGroupMemberResponse> {
    try {
      const isAdmin = await db.group.findUnique({
        where: {
          publicId: payload.groupId,
          admins: { some: { id: payload.userId } },
        },
      });
      if (!isAdmin) {
        return {
          success: false,
          message: 'Need admin access',
        };
      }
      const contacts = await db.contact.findMany({
        where: {
          publicId: { in: payload.contactIds },
        },
        include: { contact: true },
      });

      const users = contacts.map((c) => c.contact).filter(Boolean);

      await db.group.update({
        where: { publicId: payload.groupId },
        data: {
          participants: {
            disconnect: users.map((u) => ({ id: u!.id })),
          },
        },
      });

      return {
        success: true,
        message: 'Members removed',
      };
    } catch (err) {
      return {
        success: false,
        message: 'Failed to remove member',
      };
    }
  }

  async leaveGroup(payload: LeaveGroupRequest): Promise<LeaveGroupResponse> {
    try {
      await db.group.update({
        where: { publicId: payload.groupId },
        data: {
          participants: {
            disconnect: [{ id: payload.userId }],
          },
        },
      });

      return {
        success: true,
        message: 'Group left',
      };
    } catch (err) {
      return {
        success: false,
        message: 'Failed to leave group',
      };
    }
  }
}
