import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, type ClientGrpc, Transport } from '@nestjs/microservices';
import { join } from 'path';

import type {
  CreateContactRequest,
  CreateContactResponse,
  BlockContactRequest,
  BlockContactResponse,
} from '@yapper/types';
import { Observable } from 'rxjs';

export type ContactGrpcService = {
  createContact(data: CreateContactRequest): Observable<CreateContactResponse>;
  blockContact(data: BlockContactRequest): Observable<BlockContactResponse>;
};

@Injectable()
export class Contact implements OnModuleInit {
  @Client({
    transport: Transport.GRPC,
    options: {
      url: process.env.USER_SERVICE_URL || 'localhost:50052',
      package: 'user',
      protoPath: join(process.cwd(), '../../proto/user.proto'),
    },
  })
  private client!: ClientGrpc;

  public service!: ContactGrpcService;

  onModuleInit() {
    this.service = this.client.getService<ContactGrpcService>('User');
  }
}
