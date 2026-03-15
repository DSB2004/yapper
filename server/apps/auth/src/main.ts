import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'auth',
      protoPath: join(__dirname, '../../../../proto/auth.proto'),
      url: `0.0.0.0:${process.env.PORT}`,
    },
  });

  await app.init();
  await app.startAllMicroservices();
}
bootstrap();
