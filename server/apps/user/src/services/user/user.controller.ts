import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import {
  CreateUserRequest,
  UpdateUserRequest,
  GetUserRequest,
} from '@yapper/types';
import { GrpcMethod } from '@nestjs/microservices';

@Controller()
export class UserController {
  constructor(private readonly service: UserService) {}
  @GrpcMethod('User', 'CreateUser')
  async createGroup(payload: CreateUserRequest) {
    return await this.service.createUser(payload);
  }

  @GrpcMethod('User', 'UpdateUser')
  async updateGroup(payload: UpdateUserRequest) {
    return await this.service.updateUser(payload);
  }

  @GrpcMethod('User', 'GetUserRequest')
  async addGroupMember(payload: GetUserRequest) {
    return await this.service.getUser(payload);
  }
}
