import { Module } from '@nestjs/common';
import { ChatroomModule } from './chatroom/chatroom.module';
import { MessageModule } from './message/message.module';
import { ParticipantsModule } from './participants/participants.module';
import { ServicesController } from './services.controller';

@Module({
  imports: [ChatroomModule, MessageModule, ParticipantsModule],
  controllers: [ServicesController]
})
export class ServicesModule {}
