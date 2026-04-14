import { Module } from '@nestjs/common';
import { SocketsModule } from './sockets/sockets.module';
import { RpcModule } from './rpc/rpc.module';
import { KafkaModule } from './kafka/kafka.module';

@Module({
  imports: [SocketsModule, RpcModule, KafkaModule],
})
export class AppModule {}
