import { Module } from '@nestjs/common';
import { User } from './user';
import { UserService } from './user.service';
@Module({
  providers: [User, UserService],
  exports: [UserService],
})
export class UserModule {}
