import { Module } from '@nestjs/common';
import { ChatroomConsumer } from './chatroom.consumer';
import { ChatroomController } from './chatroom.controller';
import { ChatroomService } from './chatroom.service';
import { UserModule } from 'src/rpc/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Chatroom, ChatroomSchema } from 'src/model/chatroom';
import { CHATROOMCacheProvider } from './chatroom';
import { KafkaModule } from 'src/kafka/kafka.module';
import { MessageModule } from 'src/rpc/message/message.module';
import { GatewayModule } from 'src/rpc/gateway/gateway.module';
@Module({
  imports: [
    UserModule,
    MessageModule,
    GatewayModule,

    KafkaModule,

    MongooseModule.forFeature([
      { name: Chatroom.name, schema: ChatroomSchema },
    ]),
  ],
  providers: [ChatroomConsumer, ChatroomService, CHATROOMCacheProvider],
  controllers: [ChatroomController],
})
export class ChatroomModule {}
