import { Module } from '@nestjs/common';
import { ChatroomConsumer } from './chatroom.consumer';
import { ChatroomController } from './chatroom.controller';
import { ChatroomService } from './chatroom.service';
import { UserModule } from 'src/rpc/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Chatroom, ChatroomSchema } from 'src/model/chatroom';
import { CHATROOMCacheProvider } from './chatroom';
@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([
      { name: Chatroom.name, schema: ChatroomSchema },
    ]),
  ],
  providers: [ChatroomConsumer, ChatroomService, CHATROOMCacheProvider],
  controllers: [ChatroomController],
})
export class ChatroomModule {}
