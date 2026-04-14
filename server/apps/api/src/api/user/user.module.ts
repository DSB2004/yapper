import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './user';
import { CommonService } from 'src/utils/common/common.service';
import { CommonModule } from 'src/utils/common/common.module';

@Module({
  imports: [CommonModule],
  providers: [UserService, User],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
