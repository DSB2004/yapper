import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { ChatroomModule } from 'src/rpc/chatroom/chatroom.module';

@Module({
  imports: [ChatroomModule],
  providers: [GroupService],
  controllers: [GroupController],
})
export class GroupModule {}
