import { Controller } from '@nestjs/common';
import { ChatroomService } from './chatroom.service';
import {
  CreateChatroomRequest,
  CreateChatroomResponse,
  GetChatroomIdsRequest,
  GetChatroomIdsResponse,
  GetChatroomRequest,
  GetChatroomResponse,
  GetChatroomsRequest,
  GetChatroomsResponse,
} from '@yapper/types';
import { GrpcMethod } from '@nestjs/microservices';

@Controller()
export class ChatroomController {
  constructor(private readonly service: ChatroomService) {}

  @GrpcMethod('Chatroom', 'CreateChatroom')
  async createChatroom(
    data: CreateChatroomRequest,
  ): Promise<CreateChatroomResponse> {
    return await this.service.createChatroom(data);
  }

  @GrpcMethod('Chatroom', 'GetChatroom')
  async getChatroom(data: GetChatroomRequest): Promise<GetChatroomResponse> {
    return await this.service.getChatroom(data);
  }

  @GrpcMethod('Chatroom', 'GetChatrooms')
  async getChatrooms(data: GetChatroomsRequest): Promise<GetChatroomsResponse> {
    return await this.service.getChatrooms(data);
  }

  @GrpcMethod('Chatroom', 'GetChatroomIds')
  async getChatroomIds(
    data: GetChatroomIdsRequest,
  ): Promise<GetChatroomIdsResponse> {
    return await this.service.getChatroomIds(data);
  }
}
