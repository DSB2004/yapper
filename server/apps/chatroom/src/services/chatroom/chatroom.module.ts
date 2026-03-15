import { Module } from '@nestjs/common';
import { ChatroomConsumer } from './chatroom.consumer';
import { ChatroomController } from './chatroom.controller';
import { ChatroomService } from './chatroom.service';

@Module({
  providers: [ChatroomConsumer, ChatroomService],
  controllers: [ChatroomController],
})
export class ChatroomModule {}
