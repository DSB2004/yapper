import { Module } from '@nestjs/common';
import { ChatroomService } from './chatroom.service';
import { ChatroomController } from './chatroom.controller';
import { Chatroom } from './chatroom';
import { CommonModule } from 'src/utils/common/common.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [CommonModule, UserModule],
  providers: [ChatroomService, Chatroom],
  controllers: [ChatroomController],
})
export class ChatroomModule {}
