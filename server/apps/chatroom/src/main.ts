import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

async function bootstrap() {
  dotenv.config();

  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'chatroom',
      protoPath: join(__dirname, '../../../proto/chatroom.proto'),
      url: `0.0.0.0:${process.env.PORT}`,
    },
  });

  await app.init();

  // ✅ Get the connection NestJS actually created — not the global mongoose instance
  const mongoConnection = app.get<Connection>(getConnectionToken());

  if (mongoConnection.readyState !== 1) {
    console.log('⏳ Waiting for Mongoose...');
    await new Promise<void>((resolve, reject) => {
      mongoConnection.once('connected', resolve);
      mongoConnection.once('error', reject);
      setTimeout(() => reject(new Error('MongoDB connection timeout')), 15000);
    });
  }

  console.log('✅ Mongoose connected, starting microservices...');
  await app.startAllMicroservices();
  console.log(`🚀 Chatroom microservice running on port ${process.env.PORT}`);
}

bootstrap().catch((err) => {
  console.error('💥 Bootstrap failed:', err);
  process.exit(1);
});
