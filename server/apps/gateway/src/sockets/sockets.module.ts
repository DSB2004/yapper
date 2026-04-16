import { forwardRef, Module } from '@nestjs/common';
import { SocketsGateway } from './sockets.gateway';
import { Sockets } from './sockets';
import { AuthModule } from 'src/rpc/auth/auth.module';
import { UserModule } from 'src/rpc/user/user.module';
import { ChatroomModule } from 'src/rpc/chatroom/chatroom.module';
import { MessageModule } from './message/message.module';
import { CommonModule } from './common/common.module';
import { SocketsService } from './sockets.service';

@Module({
  imports: [
    AuthModule,
    UserModule,
    ChatroomModule,
    MessageModule,
    forwardRef(() => CommonModule),
  ],
  providers: [SocketsGateway, Sockets, SocketsService],
  exports: [SocketsService, Sockets],
})
export class SocketsModule {}
