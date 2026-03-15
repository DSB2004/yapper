import { Module } from '@nestjs/common';
import { KafkaProducer } from './kafka.producer';


@Module({
  exports: [KafkaProducer],
})
export class KafkaModule {}
