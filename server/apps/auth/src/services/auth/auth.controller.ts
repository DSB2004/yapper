import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  LoginRequest,
  ResendOtpRequest,
  ValidateUserRequest,
  VerifyRequest,
} from '@yapper/types';
import { GrpcMethod } from '@nestjs/microservices';

@Controller()
export class AuthController {
  constructor(private readonly service: AuthService) {}
  @GrpcMethod('Auth', 'LoginUser')
  async loginUser(payload: LoginRequest) {
    return await this.service.loginUser(payload);
  }

  @GrpcMethod('Auth', 'VerifyUser')
  async verifyUser(payload: VerifyRequest) {
    return await this.service.verifyUser(payload);
  }

  @GrpcMethod('Auth', 'ResendOtp')
  async resendOTP(payload: ResendOtpRequest) {
    return await this.service.resendOtp(payload);
  }

  @GrpcMethod('Auth', 'ValidateUser')
  async validateUser(payload: ValidateUserRequest) {
    return await this.service.validateUser(payload);
  }
}
