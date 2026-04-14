import { Module } from '@nestjs/common';
import { Chatroom } from './chatroom';
import { ChatroomService } from './chatroom.service';

@Module({
  providers: [Chatroom, ChatroomService],
  exports: [ChatroomService],
})
export class ChatroomModule {}
