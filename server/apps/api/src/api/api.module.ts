import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ValidateMiddleware } from '../middleware/validate/validate.middleware';
import { UserModule } from './user/user.module';
import { JWTMiddleware } from 'src/middleware/jwt/jwt.middleware';
import { ContactModule } from './contact/contact.module';
import { GroupModule } from './group/group.module';
import { ChatroomModule } from './chatroom/chatroom.module';
import { MessageModule } from './message/message.module';

@Module({
  imports: [AuthModule, UserModule, ContactModule, GroupModule, ChatroomModule, MessageModule],
})
export class ApiModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ValidateMiddleware).forRoutes('*');
    consumer.apply(JWTMiddleware).forRoutes('*');
  }
}
