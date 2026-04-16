import { Module } from '@nestjs/common';
import { MessageConsumer } from './message.consumer';
import { MessageService } from './message.service';
import { KafkaModule } from 'src/kafka/kafka.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Chatroom, ChatroomSchema } from 'src/model/chatroom';

@Module({
  imports: [
    KafkaModule,
    MongooseModule.forFeature([
      { name: Chatroom.name, schema: ChatroomSchema },
    ]),
  ],
  providers: [MessageConsumer, MessageService],
})
export class MessageModule {}
