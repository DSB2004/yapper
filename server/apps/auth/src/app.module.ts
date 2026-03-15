import { Module } from '@nestjs/common';
import { ServicesModule } from './services/services.module';
import { UtilsModule } from './utils/utils.module';

@Module({
  imports: [ServicesModule, UtilsModule],
})
export class AppModule {}
