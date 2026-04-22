import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { MessageModule } from './message/message.module';
import { GatewayModule } from './gateway/gateway.module';

@Module({
  imports: [UserModule, MessageModule, GatewayModule],
})
export class RpcModule {}
