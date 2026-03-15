import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, type ClientGrpc, Transport } from '@nestjs/microservices';
import { join } from 'path';

import type {
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
import { Observable } from 'rxjs';

export type AuthGrpcService = {
  loginUser(data: LoginRequest): Observable<LoginResponse>;
  verifyUser(data: VerifyRequest): Observable<VerifyResponse>;
  resendOtp(data: ResendOtpRequest): Observable<ResendOtpResponse>;
  validateUser(data: ValidateUserRequest): Observable<ValidateUserResponse>;
  healthCheck(data: Record<string, never>): Observable<HealthCheckResponse>;
};

@Injectable()
export class Auth implements OnModuleInit {
  @Client({
    transport: Transport.GRPC,
    options: {
      url: process.env.AUTH_SERVICE_URL || 'localhost:50051',
      package: 'auth',
      protoPath: join(process.cwd(), '../../proto/auth.proto'),
    },
  })
  private client!: ClientGrpc;

  public service!: AuthGrpcService;

  onModuleInit() {
    this.service = this.client.getService<AuthGrpcService>('Auth');
  }
}
