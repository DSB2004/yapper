import { Module } from '@nestjs/common';
import { ServicesModule } from './services/services.module';
import { KafkaModule } from './kafka/kafka.module';

@Module({
  imports: [ServicesModule, KafkaModule],
})
export class AppModule {}
