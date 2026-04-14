import { Module } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';
import { ChatroomModule } from 'src/rpc/chatroom/chatroom.module';

@Module({
  imports: [ChatroomModule],
  providers: [ContactService],
  controllers: [ContactController],
})
export class ContactModule {}
