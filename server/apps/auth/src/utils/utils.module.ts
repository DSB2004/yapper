import { Module } from '@nestjs/common';
import { JwtModule } from 'src/utils/jwt/jwt.module';
import { OtpModule } from 'src/utils/otp/otp.module';

@Module({
  imports: [OtpModule, JwtModule],
})
export class UtilsModule {}
