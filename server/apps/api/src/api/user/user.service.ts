import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import {
  UpdateUserResponse,
  UpdateUserRequest,
  GetUserRequest,
  GetUserResponse,
  CreateUserRequest,
  CreateUserResponse,
  GetUserByIdRequest,
  GetUserByPhoneRequest,
  HealthCheckResponse,
} from '@yapper/types';
import { User } from './user';

@Injectable()
export class UserService {
  constructor(private readonly user: User) {}

  async createUser(data: CreateUserRequest): Promise<CreateUserResponse> {
    return await firstValueFrom(this.user.service.createUser(data));
  }
  async healthCheck(): Promise<HealthCheckResponse> {
    return await firstValueFrom(this.user.service.healthCheck({}));
  }
  async getUser(data: GetUserRequest): Promise<GetUserResponse> {
    return await firstValueFrom(this.user.service.getUser(data));
  }
  async getUserByPhone(data: GetUserByPhoneRequest): Promise<GetUserResponse> {
    return await firstValueFrom(this.user.service.getUserByPhone(data));
  }
  async getUserById(data: GetUserByIdRequest): Promise<GetUserResponse> {
    return await firstValueFrom(this.user.service.getUserById(data));
  }
  async updateUser(data: UpdateUserRequest): Promise<UpdateUserResponse> {
    return await firstValueFrom(this.user.service.updateUser(data));
  }
}
