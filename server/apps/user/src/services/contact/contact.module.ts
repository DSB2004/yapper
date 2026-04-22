import { Module } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';
import { ChatroomModule } from 'src/rpc/chatroom/chatroom.module';
import { GatewayModule } from 'src/rpc/gateway/gateway.module';
import { KafkaModule } from 'src/kafka/kafka.module';

@Module({
  imports: [ChatroomModule, GatewayModule, KafkaModule],
  providers: [ContactService],
  controllers: [ContactController],
})
export class ContactModule {}
