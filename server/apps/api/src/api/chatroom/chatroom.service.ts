import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import {
  GetChatroomRequest,
  GetChatroomsRequest,
  GetChatroomResponse,
  GetChatroomsResponse,
  HealthCheckResponse,
} from '@yapper/types';
import { Chatroom } from './chatroom';

@Injectable()
export class ChatroomService {
  constructor(private readonly user: Chatroom) {}

  async getChatroom(data: GetChatroomRequest): Promise<GetChatroomResponse> {
    return await firstValueFrom(this.user.service.getChatroom(data));
  }
  async getChatrooms(data: GetChatroomsRequest): Promise<GetChatroomsResponse> {
    return await firstValueFrom(this.user.service.getChatrooms(data));
  }
  async healthCheck(): Promise<HealthCheckResponse> {
    return await firstValueFrom(this.user.service.healthCheck({}));
  }
}
