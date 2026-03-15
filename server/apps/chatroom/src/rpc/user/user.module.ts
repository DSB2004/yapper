import { Module } from '@nestjs/common';
import { User } from './user';
import { UserService } from './user.service';
import { UserService } from './user.service';

@Module({
  providers: [User, UserService]
})
export class UserModule {}
