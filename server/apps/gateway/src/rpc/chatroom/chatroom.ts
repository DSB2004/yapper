import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, type ClientGrpc, Transport } from '@nestjs/microservices';
import { join } from 'path';

import type {
  GetChatroomIdsRequest,
  GetChatroomIdsResponse,
  GetChatroomSummaryRequest,
  GetChatroomSummaryResponse,
} from '@yapper/types';
import { Observable } from 'rxjs';

export type ChatroomGrpcService = {
  getChatroomIds(
    data: GetChatroomIdsRequest,
  ): Observable<GetChatroomIdsResponse>;
  getChatroomSummary(
    data: GetChatroomSummaryRequest,
  ): Observable<GetChatroomSummaryResponse>;
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
