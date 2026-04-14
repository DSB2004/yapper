import { Controller } from '@nestjs/common';
import { GroupService } from './group.service';
import {
  AddGroupMemberRequest,
  CreateGroupRequest,
  LeaveGroupRequest,
  RemoveGroupMemberRequest,
  UpdateGroupRequest,
} from '@yapper/types';
import { GrpcMethod } from '@nestjs/microservices';

@Controller()
export class GroupController {
  constructor(private readonly service: GroupService) {}
  @GrpcMethod('User', 'CreateGroup')
  async createGroup(payload: CreateGroupRequest) {
    console.log(payload);
    return await this.service.createGroup(payload);
  }

  @GrpcMethod('User', 'UpdateGroup')
  async updateGroup(payload: UpdateGroupRequest) {
    return await this.service.updateGroup(payload);
  }

  @GrpcMethod('User', 'AddGroupMember')
  async addGroupMember(payload: AddGroupMemberRequest) {
    return await this.service.addGroupMember(payload);
  }

  @GrpcMethod('User', 'RemoveGroupMember')
  async removeGroupMember(payload: RemoveGroupMemberRequest) {
    return await this.service.removeGroupMember(payload);
  }

  @GrpcMethod('User', 'LeaveGroup')
  async leaveGroup(payload: LeaveGroupRequest) {
    return await this.service.leaveGroup(payload);
  }
}
