import { Module } from '@nestjs/common';
import { KafkaModule } from 'src/kafka/kafka.module';
import { MessageConsumer } from './message.consumer';
import { MessageService } from './message.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from 'src/models/message';
import { MessageController } from './message.controller';

@Module({
  imports: [
    KafkaModule,
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
  ],
  providers: [MessageConsumer, MessageService],
  controllers: [MessageController],
})
export class MessageModule {}
