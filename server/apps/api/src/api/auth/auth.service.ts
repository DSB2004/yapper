import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import {
  LoginRequest,
  LoginResponse,
  VerifyRequest,
  VerifyResponse,
  ResendOtpRequest,
  ResendOtpResponse,
  ValidateUserRequest,
  ValidateUserResponse,
  HealthCheckResponse,
} from '@yapper/types';
import { Auth } from './auth';

@Injectable()
export class AuthService {
  constructor(private readonly auth: Auth) {}

  async loginUser(data: LoginRequest): Promise<LoginResponse> {
    return await firstValueFrom(this.auth.service.loginUser(data));
  }

  async verifyUser(data: VerifyRequest): Promise<VerifyResponse> {
    return await firstValueFrom(this.auth.service.verifyUser(data));
  }

  async resendOtp(data: ResendOtpRequest): Promise<ResendOtpResponse> {
    return await firstValueFrom(this.auth.service.resendOtp(data));
  }

  async validateUser(data: ValidateUserRequest): Promise<ValidateUserResponse> {
    return await firstValueFrom(this.auth.service.validateUser(data));
  }

  async healthCheck(): Promise<HealthCheckResponse> {
    return await firstValueFrom(this.auth.service.healthCheck({}));
  }
}
