import { Kafka, logLevel } from 'kafkajs';

export const kafka = new Kafka({
  brokers: [process.env.KAFKA_BROKER_URL || 'localhost:9092'],
  logLevel: logLevel.ERROR,
});
