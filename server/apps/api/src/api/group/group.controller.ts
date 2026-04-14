import {
  Body,
  Controller,
  HttpCode,
  Patch,
  Put,
  Req,
  Version,
} from '@nestjs/common';
import { GroupService } from './group.service';
import { CommonService } from 'src/utils/common/common.service';
import {
  AddGroupMemberDto,
  CreateGroupDto,
  LeaveGroupDto,
  RemoveGroupMemberDto,
  UpdateGroupDto,
} from './group.dto';
import { CurrentUser } from 'src/types';

@Controller('group')
export class GroupController {
  constructor(
    private readonly service: GroupService,
    private readonly util: CommonService,
  ) {}

  @Put('')
  @Version('1')
  @HttpCode(200)
  async createGroup(@Body() data: CreateGroupDto, @CurrentUser() user) {
    const { phone, authId } = user;
    const result = await this.service.createGroup({ ...data, authId });
    return this.util.handleResponse(result);
  }

  @Patch('')
  @Version('1')
  @HttpCode(200)
  async updateGroup(@Body() data: UpdateGroupDto, @CurrentUser() user) {
    const { authId } = user;
    const result = await this.service.updateGroup({ ...data, authId });
    return this.util.handleResponse(result);
  }

  @Patch('/member/add')
  @Version('1')
  @HttpCode(200)
  async addMember(@Body() data: AddGroupMemberDto, @CurrentUser() user) {
    const { authId } = user;
    const result = await this.service.addMember({ ...data, authId });
    return this.util.handleResponse(result);
  }

  @Patch('/member/remove')
  @Version('1')
  @HttpCode(200)
  async removeMember(@Body() data: RemoveGroupMemberDto, @CurrentUser() user) {
    const { authId } = user;
    const result = await this.service.removeMember({ ...data, authId });
    return this.util.handleResponse(result);
  }

  @Patch('/member/leave')
  @Version('1')
  @HttpCode(200)
  async leaveGroup(@Body() data: LeaveGroupDto, @CurrentUser() user) {
    const { authId } = user;
    const result = await this.service.leaveGroup({ ...data, authId });
    return this.util.handleResponse(result);
  }
}
