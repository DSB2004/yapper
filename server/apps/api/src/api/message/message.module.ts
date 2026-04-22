import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { Message } from './message';
import { CommonModule } from 'src/utils/common/common.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [CommonModule, UserModule],
  controllers: [MessageController],
  providers: [MessageService, Message],
})
export class MessageModule {}
