import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Auth } from './auth';

@Module({
  providers: [AuthService, Auth],
  controllers: [AuthController],
})
export class AuthModule {}
