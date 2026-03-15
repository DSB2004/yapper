import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, type ClientGrpc, Transport } from '@nestjs/microservices';
import { join } from 'path';

import type { GetUsersResponse, GetUsersRequest } from '@yapper/types';
import { Observable } from 'rxjs';

export type UserGrpcService = {
  getUsers(data: GetUsersRequest): Observable<GetUsersResponse>;
};

@Injectable()
export class User implements OnModuleInit {
  @Client({
    transport: Transport.GRPC,
    options: {
      url: process.env.USER_SERVICE_URL || 'localhost:50051',
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
