import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { KafkaConsumer } from 'src/kafka/kafka.consumer';
import { KAFKA_EVENTS } from '@yapper/types';
import { MessageService } from './message.service';

@Injectable()
export class MessageConsumer implements OnModuleInit {
  constructor(
    private readonly consumer: KafkaConsumer,
    private readonly service: MessageService,
  ) {}

  private readonly logger = new Logger(MessageService.name);
  async onModuleInit() {
    await this.consumer.consume(
      'message-message-service',
      {
        topics: Object.values(KAFKA_EVENTS.MESSAGE),
      },
      {
        eachMessage: async ({ topic, partition, message }) => {
          let payload: any = {};

          try {
            payload = JSON.parse(message?.value?.toString() || '{}');
          } catch (e) {
            this.logger.error('Invalid JSON payload', e);
            return;
          }

          this.logger.log('[MESSAGE]', topic, payload);
          switch (topic) {
            case KAFKA_EVENTS.MESSAGE.ADD:
              await this.service.addMessage(payload);
              break;

            case KAFKA_EVENTS.MESSAGE.UPDATE:
              await this.service.updateMessage(payload);
              break;

            case KAFKA_EVENTS.MESSAGE.DELETE:
              await this.service.deleteMessage(payload);
              break;

            case KAFKA_EVENTS.MESSAGE.STAR:
              await this.service.starMessage(payload);
              break;

            case KAFKA_EVENTS.MESSAGE.PIN:
              await this.service.pinMessage(payload);
              break;

            case KAFKA_EVENTS.MESSAGE.REACTION:
              await this.service.reactionMessage(payload);
              break;

            case KAFKA_EVENTS.MESSAGE.SEEN:
              await this.service.seenMessage(payload);
              break;

            case KAFKA_EVENTS.MESSAGE.RECEIVED:
              await this.service.receivedMessage(payload);
              break;

            default:
              this.logger.warn(`Unhandled topic: ${topic}`);
          }
        },
      },
    );
  }
}
