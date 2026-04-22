import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { GetUnreadCountRequest, GetUnreadCountResponse } from '@yapper/types';
import { Message } from './message';

@Injectable()
export class MessageService {
  constructor(private readonly Message: Message) {}

  async getUnreadCount(
    data: GetUnreadCountRequest,
  ): Promise<GetUnreadCountResponse> {
    return await firstValueFrom(this.Message.service.getUnreadCount(data));
  }
}
