import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import {
  AddUsersToChatroomRequest,
  AddUsersToChatroomResponse,
  RemoveUsersFromChatroomRequest,
  RemoveUsersFromChatroomResponse,
} from '@yapper/types';
import { CommonService } from './common.service';

@Controller()
export class CommonController {
  constructor(private readonly service: CommonService) {}
  @GrpcMethod('Gateway', 'AddUsersToChatroom')
  async addUsersToRoom(
    data: AddUsersToChatroomRequest,
  ): Promise<AddUsersToChatroomResponse> {
    return await this.service.addUsersToRoom(data);
  }

  @GrpcMethod('Gateway', 'RemoveUsersFromChatroom')
  async removeUsersFromChatroom(
    data: RemoveUsersFromChatroomRequest,
  ): Promise<RemoveUsersFromChatroomResponse> {
    return await this.service.removeUsersFromRoom(data);
  }
}
