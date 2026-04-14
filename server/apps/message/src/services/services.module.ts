import { Module } from '@nestjs/common';
import { MessageModule } from './message/message.module';
import { ServicesController } from './services.controller';

@Module({
  imports: [MessageModule],
  controllers: [ServicesController]
})
export class ServicesModule {}
