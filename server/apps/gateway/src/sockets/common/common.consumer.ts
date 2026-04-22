import { Injectable, OnModuleInit } from '@nestjs/common';
import { KafkaConsumer } from 'src/kafka/kafka.consumer';
import { KAFKA_EVENTS } from '@yapper/types';
import { CommonService } from './common.service';
@Injectable()
export class CommonConsumer implements OnModuleInit {
  constructor(
    private readonly consumer: KafkaConsumer,
    private readonly service: CommonService,
  ) {}

  async onModuleInit() {
    await this.consumer.consume(
      'common-gateway-service',
      {
        topics: [
          KAFKA_EVENTS.GROUP.GROUP_UPDATE,
          KAFKA_EVENTS.CONTACT.BLOCK,
          KAFKA_EVENTS.CONTACT.UNBLOCK,
        ],
      },
      {
        eachMessage: async ({ topic, partition, message }) => {
          const payload = JSON.parse(message?.value?.toString() || '{}');
          console.log(
            '[COMMON][GATEWAY]',
            topic,
            JSON.parse(message.value?.toString() || '{}'),
          );

          switch (topic) {
            case KAFKA_EVENTS.GROUP.GROUP_UPDATE:
              await this.service.sendGroupUpdate(payload);
              break;

            case KAFKA_EVENTS.CONTACT.BLOCK:
              await this.service.blockUser(payload);
              break;

            case KAFKA_EVENTS.CONTACT.UNBLOCK:
              await this.service.unBlockUser(payload);
              break;
          }
        },
      },
    );
  }
}
