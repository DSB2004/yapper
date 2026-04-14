import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user';

@Module({
  providers: [UserService, User],
  exports: [UserService],
})
export class UserModule {}
