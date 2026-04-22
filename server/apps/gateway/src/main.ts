import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'gateway',
      protoPath: join(__dirname, '../../../proto/gateway.proto'),
      url: `0.0.0.0:${process.env.GRPC_PORT ?? 50055}`,
    },
  });

  await app.init();
  await app.startAllMicroservices();
  await app.listen(process.env.GATEAY_PORT ?? 9000);
}
bootstrap();
