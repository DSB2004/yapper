import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { Message } from './message';

@Module({
  controllers: [MessageController],
  providers: [MessageService, Message]
})
export class MessageModule {}
