import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { USER_CACHE, UserCacheProvider } from './user';

@Module({
  providers: [UserService, UserCacheProvider],

  controllers: [UserController],
})
export class UserModule {}
