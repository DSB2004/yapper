import { Injectable } from '@nestjs/common';
import {
  GetMessageRequest,
  GetMessageResponse,
  HealthCheckResponse,
} from '@yapper/types';
import { firstValueFrom } from 'rxjs';
import { Message } from './message';

@Injectable()
export class MessageService {
  constructor(private readonly message: Message) {}
  async getMessages(data: GetMessageRequest): Promise<GetMessageResponse> {
    return await firstValueFrom(this.message.service.getMessages(data));
  }
  async healthCheck(): Promise<HealthCheckResponse> {
    return await firstValueFrom(this.message.service.healthCheck({}));
  }
}
