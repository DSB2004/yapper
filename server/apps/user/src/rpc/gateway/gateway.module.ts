import { Module } from '@nestjs/common';
import { Gateway } from './gateway';
import { GatewayService } from './gateway.service';
@Module({
  providers: [Gateway, GatewayService],

  exports: [GatewayService],
})
export class GatewayModule {}
