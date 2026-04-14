import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, type ClientGrpc, Transport } from '@nestjs/microservices';
import { join } from 'path';

import type {
  CreateGroupRequest,
  CreateGroupResponse,
  AddGroupMemberRequest,
  AddGroupMemberResponse,
  RemoveGroupMemberRequest,
  RemoveGroupMemberResponse,
  LeaveGroupRequest,
  LeaveGroupResponse,
  UpdateGroupRequest,
  UpdateGroupResponse,
} from '@yapper/types';
import { Observable } from 'rxjs';

export type GroupGrpcService = {
  createGroup(data: CreateGroupRequest): Observable<CreateGroupResponse>;
  updateGroup(data: UpdateGroupRequest): Observable<UpdateGroupResponse>;
  addMember(data: AddGroupMemberRequest): Observable<AddGroupMemberResponse>;
  removeMember(
    data: RemoveGroupMemberRequest,
  ): Observable<RemoveGroupMemberResponse>;
  leaveMember(data: LeaveGroupRequest): Observable<LeaveGroupResponse>;
};

@Injectable()
export class Group implements OnModuleInit {
  @Client({
    transport: Transport.GRPC,
    options: {
      url: process.env.USER_SERVICE_URL || 'localhost:50052',
      package: 'user',
      protoPath: join(process.cwd(), '../../proto/user.proto'),
    },
  })
  private client!: ClientGrpc;

  public service!: GroupGrpcService;

  onModuleInit() {
    this.service = this.client.getService<GroupGrpcService>('User');
  }
}
