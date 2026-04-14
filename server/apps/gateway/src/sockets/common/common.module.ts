import { forwardRef, Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { CommonConsumer } from './common.consumer';
import { SocketsModule } from '../sockets.module';
import { KafkaModule } from 'src/kafka/kafka.module';
import { CommonGateway } from './common.gateway';

@Module({
  imports: [forwardRef(() => SocketsModule), KafkaModule],
  providers: [CommonService, CommonConsumer, CommonGateway],
  exports: [CommonService],
})
export class CommonModule {}
