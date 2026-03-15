import { Injectable } from '@nestjs/common';
import { db } from 'src/lib/db';
import { generateCuid } from '@yapper/utils';

import {
  GetUserRequest,
  GetUserResponse,
  CreateUserRequest,
  CreateUserResponse,
  UpdateUserRequest,
  UpdateUserResponse,
} from '@yapper/types';

@Injectable()
export class UserService {
  async getUser(payload: GetUserRequest): Promise<GetUserResponse> {
    try {
      const { userId } = payload;

      const user = await db.user.findUnique({
        where: { publicId: userId },
      });

      if (!user) {
        return {
          userId: '',
          firstName: '',
          lastName: '',
          phone: '',
          avatar: '',
          success: false,
          message: 'User not found',
        };
      }

      return {
        userId: user.publicId,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        avatar: user.avatar ?? '',
        bio: user.bio ?? '',
        success: true,
        message: 'User fetched',
      };
    } catch (err) {
      return {
        userId: '',
        firstName: '',
        lastName: '',
        phone: '',
        avatar: '',
        success: false,
        message: 'Failed to get user',
      };
    }
  }

  async createUser(payload: CreateUserRequest): Promise<CreateUserResponse> {
    try {
      const user = await db.user.create({
        data: {
          publicId: generateCuid('user'),
          authId: payload.authId,
          firstName: payload.firstName,
          lastName: payload.lastName,
          phone: payload.phone,
          avatar: payload.avatar,
        },
      });

      return {
        userId: user.publicId,
        success: true,
        message: 'User created',
      };
    } catch (err) {
      return {
        userId: '',
        success: false,
        message: 'Failed to create User',
      };
    }
  }

  async updateUser(payload: UpdateUserRequest): Promise<UpdateUserResponse> {
    try {
      await db.user.update({
        where: { publicId: payload.userId },
        data: {
          firstName: payload.firstName,
          lastName: payload.lastName,
          avatar: payload.avatar,
        },
      });

      // user_profile_update  kafka event
      return {
        success: true,
        message: 'User updated',
      };
    } catch (err) {
      return {
        success: false,
        message: 'Failed to update User',
      };
    }
  }
}
