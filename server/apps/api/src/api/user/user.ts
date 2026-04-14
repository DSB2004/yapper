import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, type ClientGrpc, Transport } from '@nestjs/microservices';
import { join } from 'path';

import type {
  CreateUserRequest,
  CreateUserResponse,
  UpdateUserResponse,
  UpdateUserRequest,
  GetUserRequest,
  GetUserResponse,
  GetUserByPhoneRequest,
  GetUserByIdRequest,
  HealthCheckResponse,
} from '@yapper/types';
import { Observable } from 'rxjs';

export type UserGrpcService = {
  getUser(data: GetUserRequest): Observable<GetUserResponse>;
  getUserByPhone(data: GetUserByPhoneRequest): Observable<GetUserResponse>;
  getUserById(data: GetUserByIdRequest): Observable<GetUserResponse>;
  createUser(data: CreateUserRequest): Observable<CreateUserResponse>;
  updateUser(data: UpdateUserRequest): Observable<UpdateUserResponse>;
  healthCheck(data: Record<string, never>): Observable<HealthCheckResponse>;
};

@Injectable()
export class User implements OnModuleInit {
  @Client({
    transport: Transport.GRPC,
    options: {
      url: process.env.USER_SERVICE_URL || 'localhost:50052',
      package: 'user',
      protoPath: join(process.cwd(), '../../proto/user.proto'),
    },
  })
  private client!: ClientGrpc;

  public service!: UserGrpcService;

  onModuleInit() {
    this.service = this.client.getService<UserGrpcService>('User');
  }
}
