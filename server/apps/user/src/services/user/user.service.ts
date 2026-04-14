import { Inject, Injectable } from '@nestjs/common';
import { db } from 'src/lib/db';
import { generateCuid } from '@yapper/utils';
import { LRUCache } from 'lru-cache/raw';
import { redis } from 'src/lib/redis';
import {
  GetUserRequest,
  GetUserResponse,
  CreateUserRequest,
  CreateUserResponse,
  UpdateUserRequest,
  UpdateUserResponse,
  GetUsersRequest,
  GetUsersResponse,
} from '@yapper/types';
import { USER_CACHE } from './user';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_CACHE)
    private readonly cache: LRUCache<string, any>,
  ) {}
  async getUser(payload: GetUserRequest): Promise<GetUserResponse> {
    try {
      const { authId } = payload;
      

      const cached = this.cache.get(authId);

      if (cached) {
        return {
          userId: cached.publicId,
          firstName: cached.firstName,
          lastName: cached.lastName,
          phone: cached.phone,
          avatar: cached.avatar ?? '',
          bio: cached.bio ?? '',
          success: true,
          message: 'User fetched',
          status: 200,
        };
      }

      const redisUser = await redis.get(`user:${authId}`);

      if (redisUser) {
        const parsed = JSON.parse(redisUser);

        this.cache.set(authId, parsed);

        return {
          userId: parsed.publicId,
          firstName: parsed.firstName,
          lastName: parsed.lastName,
          phone: parsed.phone,
          avatar: parsed.avatar ?? '',
          bio: parsed.bio ?? '',
          success: true,
          message: 'User fetched',
          status: 200,
        };
      }

      const user = await db.user.findUnique({
        where: { authId },
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
          status: 404,
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
        status: 200,
      };
    } catch (err) {
      return {
        userId: '',
        firstName: '',
        lastName: '',
        phone: '',
        avatar: '',
        success: false,
        message: 'Internal Server Error',
        status: 500,
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
        authId: payload.authId,
        status: 200,
        success: true,
        message: 'User created',
      };
    } catch (err) {
      return {
        status: 500,
        authId: payload.authId,
        success: false,
        message: 'Internal Server Error',
      };
    }
  }

  async updateUser(payload: UpdateUserRequest): Promise<UpdateUserResponse> {
    try {
      await db.user.update({
        where: { authId: payload.authId },
        data: {
          firstName: payload.firstName,
          lastName: payload.lastName,
          avatar: payload.avatar,
        },
      });

      // user_profile_update  kafka event
      return {
        success: true,
        status: 200,
        message: 'User updated',
      };
    } catch (err) {
      return {
        success: false,
        status: 500,
        message: 'Internal Server Error',
      };
    }
  }

  async getUsers(payload: GetUsersRequest): Promise<GetUsersResponse> {
    try {
      const { userIds } = payload;

      const result: any[] = [];
      const missingIds: string[] = [];

      for (const id of userIds) {
        const cached = this.cache.get(id);

        if (cached) {
          result.push(cached);
        } else {
          missingIds.push(id);
        }
      }
      const redisMissing: string[] = [];

      for (const id of missingIds) {
        const redisUser = await redis.get(`user:${id}`);

        if (redisUser) {
          const parsed = JSON.parse(redisUser);

          this.cache.set(id, parsed);

          result.push(parsed);
        } else {
          redisMissing.push(id);
        }
      }
      if (redisMissing.length > 0) {
        const users = await db.user.findMany({
          where: {
            publicId: {
              in: redisMissing,
            },
          },
        });

        for (const user of users) {
          const formatted = {
            userId: user.publicId,
            firstName: user.firstName,
            lastName: user.lastName,
            name: `${user.firstName} ${user.lastName}`,
            phone: user.phone,
            avatar: user.avatar ?? '',
            bio: user.bio ?? '',
          };

          result.push(formatted);
          this.cache.set(user.publicId, formatted);

          await redis.set(
            `user:${user.publicId}`,
            JSON.stringify(formatted),
            'EX',
            60 * 10,
          );
        }
      }

      return {
        users: result,
        success: true,
        status: 200,
        message: 'Users fetched',
      };
    } catch (err) {
      return {
        users: [],
        success: false,
        status: 500,
        message: 'Internal Server Error',
      };
    }
  }
}
