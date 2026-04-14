import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Auth } from './auth';
import { CommonModule } from 'src/utils/common/common.module';

@Module({
  imports: [CommonModule],
  providers: [AuthService, Auth],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
