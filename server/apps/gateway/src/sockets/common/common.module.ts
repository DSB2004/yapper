import { forwardRef, Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { CommonConsumer } from './common.consumer';
import { SocketsModule } from '../sockets.module';
import { KafkaModule } from 'src/kafka/kafka.module';
import { CommonGateway } from './common.gateway';
import { CommonController } from './common.controller';
import { ChatroomModule } from 'src/rpc/chatroom/chatroom.module';

@Module({
  imports: [forwardRef(() => SocketsModule), KafkaModule, ChatroomModule],

  providers: [CommonService, CommonConsumer, CommonGateway],
  exports: [CommonService],
  controllers: [CommonController],
})
export class CommonModule {}
