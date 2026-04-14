import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, type ClientGrpc, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { GetUserRequest, GetUserResponse } from '@yapper/types';
import { Observable } from 'rxjs';

export type UserGrpcService = {
  getUser(data: GetUserRequest): Observable<GetUserResponse>;
};

@Injectable()
export class User implements OnModuleInit {
  @Client({
    transport: Transport.GRPC,
    options: {
      url: process.env.User_SERVICE_URL || 'localhost:50052',
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
