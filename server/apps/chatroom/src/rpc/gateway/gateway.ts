import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, type ClientGrpc, Transport } from '@nestjs/microservices';
import { join } from 'path';
import {
  AddUsersToChatroomRequest,
  AddUsersToChatroomResponse,
} from '@yapper/types';
import { Observable } from 'rxjs';

export type GatewayGrpcService = {
  addUsersToChatroom(
    data: AddUsersToChatroomRequest,
  ): Observable<AddUsersToChatroomResponse>;
};

@Injectable()
export class Gateway implements OnModuleInit {
  @Client({
    transport: Transport.GRPC,
    options: {
      url: process.env.GATEWAY_SERVICE_URL || 'localhost:50055',
      package: 'gateway',
      protoPath: join(process.cwd(), '../../proto/gateway.proto'),
    },
  })
  private client!: ClientGrpc;

  public service!: GatewayGrpcService;

  onModuleInit() {
    this.service = this.client.getService<GatewayGrpcService>('Gateway');
  }
}
