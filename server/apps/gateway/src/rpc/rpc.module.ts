import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ChatroomModule } from './chatroom/chatroom.module';

@Module({
  imports: [AuthModule, UserModule, ChatroomModule]
})
export class RpcModule {}
