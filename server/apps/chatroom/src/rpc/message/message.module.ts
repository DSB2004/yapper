import { Module } from '@nestjs/common';
import { Message } from './message';
import { MessageService } from './message.service';
@Module({
  providers: [Message, MessageService],
  exports: [MessageService],
})
export class MessageModule {}
