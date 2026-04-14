import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import {
  CreateUserRequest,
  UpdateUserRequest,
  GetUserRequest,
  GetUsersRequest,
} from '@yapper/types';
import { GrpcMethod } from '@nestjs/microservices';

@Controller()
export class UserController {
  constructor(private readonly service: UserService) {}
  @GrpcMethod('User', 'CreateUser')
  async createUser(payload: CreateUserRequest) {
    return await this.service.createUser(payload);
  }

  @GrpcMethod('User', 'UpdateUser')
  async updateUser(payload: UpdateUserRequest) {
    return await this.service.updateUser(payload);
  }

  @GrpcMethod('User', 'GetUser')
  async getUser(payload: GetUserRequest) {
    return await this.service.getUser(payload);
  }

  @GrpcMethod('User', 'GetUsers')
  async getUsers(payload: GetUsersRequest) {
    return await this.service.getUsers(payload);
  }
}
