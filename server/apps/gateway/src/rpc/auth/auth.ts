import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, type ClientGrpc, Transport } from '@nestjs/microservices';
import { join } from 'path';

import type { ValidateUserRequest, ValidateUserResponse } from '@yapper/types';
import { Observable } from 'rxjs';

export type AuthGrpcService = {
  validateUser(data: ValidateUserRequest): Observable<ValidateUserResponse>;
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
