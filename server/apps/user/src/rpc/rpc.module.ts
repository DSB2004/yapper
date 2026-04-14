import { Module } from '@nestjs/common';
import { ChatroomModule } from './chatroom/chatroom.module';

@Module({
  imports: [ChatroomModule]
})
export class RpcModule {}
