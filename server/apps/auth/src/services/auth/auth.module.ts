import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { OtpService } from 'src/utils/otp/otp.service';
import { JwtService } from 'src/utils/jwt/jwt.service';
@Module({
  providers: [AuthService, OtpService, JwtService],
  controllers: [AuthController],
})
export class AuthModule {}
