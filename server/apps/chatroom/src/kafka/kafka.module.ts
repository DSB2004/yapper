import { Module } from '@nestjs/common';
import { KafkaProducer } from './kafka.producer';
import { KafkaConsumer } from './kafka.consumer';

@Module({
  providers: [KafkaConsumer, KafkaProducer],
  exports: [KafkaConsumer, KafkaProducer],
})
export class KafkaModule {}
