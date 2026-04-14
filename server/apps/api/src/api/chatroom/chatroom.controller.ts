import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Put,
  Req,
  Version,
} from '@nestjs/common';
import { type Request } from 'express';
import { ChatroomService } from './chatroom.service';
import { CommonService } from 'src/utils/common/common.service';
import { UserService } from '../user/user.service';
import { CurrentUser } from 'src/types';

@Controller('chatroom')
export class ChatroomController {
  constructor(
    private readonly service: ChatroomService,
    private readonly util: CommonService,
    private readonly user: UserService,
  ) {}

  @Get(':id')
  @Version('1')
  @HttpCode(200)
  async getChatroom(@Param('id') id: string) {
    const result = await this.service.getChatroom({ chatroomId: id });
    return this.util.handleResponse(result);
  }

  @Get('')
  @Version('1')
  @HttpCode(200)
  async getChatrooms(@CurrentUser() _user) {
    const { authId } = _user;
    const user = await this.user.getUser({ authId });
    const result = await this.service.getChatrooms({ userId: user.userId });
    return this.util.handleResponse(result);
  }
}
