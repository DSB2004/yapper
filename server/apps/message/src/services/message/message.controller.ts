import { Controller } from '@nestjs/common';
import { MessageService } from './message.service';
import { GetMessageRequest, GetMessageResponse } from '@yapper/types';
import { GrpcMethod } from '@nestjs/microservices';

@Controller()
export class MessageController {
  constructor(private readonly service: MessageService) {}

  @GrpcMethod('Message', 'GetMessages')
  async getMessages(data: GetMessageRequest): Promise<GetMessageResponse> {
    return await this.service.getMessages(data);
  }
}
