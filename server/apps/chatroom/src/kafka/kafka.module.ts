import { Module } from '@nestjs/common';
import { KafkaProducer } from './kafka.producer';
import { KafkaConsumer } from './kafka.consumer';
import { kafka } from './kafka';

@Module({
  providers: [KafkaConsumer, KafkaProducer],
})
export class KafkaModule {}
