import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, type ClientGrpc, Transport } from '@nestjs/microservices';
import { join } from 'path';

import type {
  GetMessageRequest,
  GetMessageResponse,
  HealthCheckResponse,
} from '@yapper/types';
import { Observable } from 'rxjs';

export type MessageGrpcService = {
  healthCheck(data: Record<string, never>): Observable<HealthCheckResponse>;
  getMessages(data: GetMessageRequest): Observable<GetMessageResponse>;
};

@Injectable()
export class Message implements OnModuleInit {
  @Client({
    transport: Transport.GRPC,
    options: {
      url: process.env.MESSAGE_SERVICE_URL || 'localhost:50054',
      package: 'message',
      protoPath: join(process.cwd(), '../../proto/message.proto'),
    },
  })
  private client!: ClientGrpc;

  public service!: MessageGrpcService;

  onModuleInit() {
    this.service = this.client.getService<MessageGrpcService>('Message');
  }
}
