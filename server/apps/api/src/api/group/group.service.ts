import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import {
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
import { Group } from './group';

@Injectable()
export class GroupService {
  constructor(private readonly group: Group) {}

  async createGroup(data: CreateGroupRequest): Promise<CreateGroupResponse> {
    return await firstValueFrom(this.group.service.createGroup(data));
  }
  async updateGroup(data: UpdateGroupRequest): Promise<UpdateGroupResponse> {
    return await firstValueFrom(this.group.service.updateGroup(data));
  }
  async addMember(
    data: AddGroupMemberRequest,
  ): Promise<AddGroupMemberResponse> {
    return await firstValueFrom(this.group.service.addMember(data));
  }
  async removeMember(
    data: RemoveGroupMemberRequest,
  ): Promise<RemoveGroupMemberResponse> {
    return await firstValueFrom(this.group.service.removeMember(data));
  }
  async leaveGroup(data: LeaveGroupRequest): Promise<LeaveGroupResponse> {
    return await firstValueFrom(this.group.service.leaveMember(data));
  }
}
