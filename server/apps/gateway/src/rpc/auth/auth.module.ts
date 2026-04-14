import { Module } from '@nestjs/common';
import { Auth } from './auth';
import { AuthService } from './auth.service';

@Module({
  providers: [Auth, AuthService],
  exports:[AuthService]
})
export class AuthModule {}
