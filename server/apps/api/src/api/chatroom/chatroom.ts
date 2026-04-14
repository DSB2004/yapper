import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, type ClientGrpc, Transport } from '@nestjs/microservices';
import { join } from 'path';

import type {
  GetChatroomRequest,
  GetChatroomsRequest,
  GetChatroomResponse,
  GetChatroomsResponse,
  HealthCheckResponse,
} from '@yapper/types';
import { Observable } from 'rxjs';

export type ChatroomGrpcService = {
  getChatroom(data: GetChatroomRequest): Observable<GetChatroomResponse>;
  getChatrooms(data: GetChatroomsRequest): Observable<GetChatroomsResponse>;
  healthCheck(data: Record<string, never>): Observable<HealthCheckResponse>;
};

@Injectable()
export class Chatroom implements OnModuleInit {
  @Client({
    transport: Transport.GRPC,
    options: {
      url: process.env.CHATROOM_SERVICE_URL || 'localhost:50053',
      package: 'chatroom',
      protoPath: join(process.cwd(), '../../proto/chatroom.proto'),
    },
  })
  private client!: ClientGrpc;

  public service!: ChatroomGrpcService;

  onModuleInit() {
    this.service = this.client.getService<ChatroomGrpcService>('Chatroom');
  }
}
