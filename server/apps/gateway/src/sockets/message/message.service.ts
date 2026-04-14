import { Injectable, Logger } from '@nestjs/common';
import { KafkaProducer } from 'src/kafka/kafka.producer';
import { KAFKA_EVENTS } from '@yapper/types';

@Injectable()
export class MessageService {
  private readonly logger = new Logger(MessageService.name);

  constructor(private readonly producer: KafkaProducer) {}

  async addMessage(payload: any) {
    try {
      await this.producer.produce(KAFKA_EVENTS.MESSAGE.ADD, [payload]);
    } catch (err) {
      this.logger.error('Kafka ADD message failed', err);
    }
  }

  async updateMessage(payload: any) {
    try {
      await this.producer.produce(KAFKA_EVENTS.MESSAGE.UPDATE, [payload]);
    } catch (err) {
      this.logger.error('Kafka UPDATE message failed', err);
    }
  }

  async deleteMessage(payload: any) {
    try {
      await this.producer.produce(KAFKA_EVENTS.MESSAGE.DELETE, [payload]);
    } catch (err) {
      this.logger.error('Kafka DELETE message failed', err);
    }
  }

  async pinMessage(payload: any) {
    try {
      await this.producer.produce(KAFKA_EVENTS.MESSAGE.PIN, [payload]);
    } catch (err) {
      this.logger.error('Kafka PIN message failed', err);
    }
  }

  async starMessage(payload: any) {
    try {
      await this.producer.produce(KAFKA_EVENTS.MESSAGE.STAR, [payload]);
    } catch (err) {
      this.logger.error('Kafka STAR message failed', err);
    }
  }

  async reactionMessage(payload: any) {
    try {
      await this.producer.produce(KAFKA_EVENTS.MESSAGE.REACTION, [payload]);
    } catch (err) {
      this.logger.error('Kafka REACTION message failed', err);
    }
  }

  async seenMessage(payload: any) {
    try {
      await this.producer.produce(KAFKA_EVENTS.MESSAGE.SEEN, [payload]);
    } catch (err) {
      this.logger.error('Kafka SEEN message failed', err);
    }
  }

  async receivedMessage(payload: any) {
    try {
      await this.producer.produce(KAFKA_EVENTS.MESSAGE.RECEIVED, [payload]);
    } catch (err) {
      this.logger.error('Kafka RECEIVED message failed', err);
    }
  }
}
