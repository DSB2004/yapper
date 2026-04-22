import { Controller, Get, HttpCode, Param, Version } from '@nestjs/common';
import { MessageService } from './message.service';
import { CommonService } from 'src/utils/common/common.service';
import { CurrentUser } from 'src/types';
import { UserService } from '../user/user.service';

@Controller('message')
export class MessageController {
  constructor(
    private readonly service: MessageService,
    private readonly util: CommonService,
    private readonly user: UserService,
  ) {}
  @Get('health')
  @Version('1')
  async healthCheck() {
    const result = await this.service.healthCheck();
    return this.util.handleResponse(result);
  }
  @Get(':id')
  @Version('1')
  @HttpCode(200)
  async getChatroom(@Param('id') id: string, @CurrentUser() user) {
    const { authId } = user;
    const userDetails = await this.user.getUser({ authId });
    let result = await this.service.getMessages({
      chatroom: id,
      userId: userDetails.userId,
    });
    if (!result.data) result.data = [];
    return this.util.handleResponse(result);
  }
}
