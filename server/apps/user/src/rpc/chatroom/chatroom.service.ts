import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { CreateChatroomResponse, CreateChatroomRequest } from '@yapper/types';
import { Chatroom } from './chatroom';

@Injectable()
export class ChatroomService {
  constructor(private readonly chatroom: Chatroom) {}

  async createChatroom(
    data: CreateChatroomRequest,
  ): Promise<CreateChatroomResponse> {
    return await firstValueFrom(this.chatroom.service.createChatroom(data));
  }
}
