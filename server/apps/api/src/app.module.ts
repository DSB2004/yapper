import { Module } from '@nestjs/common';

import { ApiModule } from './api/api.module';
import { UtilsModule } from './utils/utils.module';

@Module({
  imports: [ApiModule, UtilsModule],
})
export class AppModule {}
