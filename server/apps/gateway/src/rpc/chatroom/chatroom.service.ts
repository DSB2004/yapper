import { Injectable } from '@nestjs/common';
import { Chatroom } from './chatroom';
import type {
  GetChatroomIdsRequest,
  GetChatroomIdsResponse,
  GetChatroomSummaryRequest,
  GetChatroomSummaryResponse,
} from '@yapper/types';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ChatroomService {
  constructor(private readonly Chatroom: Chatroom) {}

  async getChatroomIds(
    data: GetChatroomIdsRequest,
  ): Promise<GetChatroomIdsResponse> {
    return await firstValueFrom(this.Chatroom.service.getChatroomIds(data));
  }

  async getChatroomSummary(
    data: GetChatroomSummaryRequest,
  ): Promise<GetChatroomSummaryResponse> {
    return await firstValueFrom(this.Chatroom.service.getChatroomSummary(data));
  }
}
