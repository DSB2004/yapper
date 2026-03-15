import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServicesModule } from './services/services.module';
import { KafkaModule } from './kafka/kafka.module';
import { RpcModule } from './rpc/rpc.module';

@Module({
  imports: [ServicesModule, KafkaModule, RpcModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
