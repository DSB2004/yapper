import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Kafka, Producer } from 'kafkajs';
import { kafka } from './kafka';
@Injectable()
export class KafkaProducer implements OnModuleInit, OnModuleDestroy {
  private kafka: Kafka;
  private producer: Producer;
  constructor() {
    this.kafka = kafka;
    this.producer = this.kafka.producer();
  }

  async onModuleInit() {
    await this.producer.connect();
  }
  async onModuleDestroy() {
    await this.producer.disconnect();
  }

  async produce(topic: string, messages: any[]) {
    const formatted = messages.map((m) => ({
      value: typeof m === 'string' ? m : JSON.stringify(m),
    }));

    await this.producer.send({
      topic,
      messages: formatted,
    });
  }
}
