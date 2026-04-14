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
import { UserService } from './user.service';
import { UpsertUserDto } from './user.dto';
import { CommonService } from 'src/utils/common/common.service';
import { CurrentUser } from 'src/types';

@Controller('user')
export class UserController {
  constructor(
    private readonly service: UserService,
    private readonly util: CommonService,
  ) {}

  @Put('')
  @Version('1')
  @HttpCode(200)
  async createUser(@Body() data: UpsertUserDto, @CurrentUser() user) {
    const { phone, authId } = user;
    const result = await this.service.createUser({ ...data, phone, authId });
    return this.util.handleResponse(result);
  }

  @Patch('')
  @Version('1')
  @HttpCode(200)
  async updateUser(@Body() data: UpsertUserDto, @Req() req: Request) {
    const { authId } = req as any;
    const result = await this.service.updateUser({ ...data, authId });
    return this.util.handleResponse(result);
  }

  @Get('')
  @Version('1')
  async getUser(@CurrentUser() user) {
    const { authId } = user;
    const result = await this.service.getUser({ authId });
    return this.util.handleResponse(result);
  }

  @Get('/phone/:phone')
  @Version('1')
  async getUserByPhone(@Param('phone') phone: string) {
    const result = await this.service.getUserByPhone({ phone });
    return this.util.handleResponse(result);
  }

  @Get('/profile/:id')
  @Version('1')
  async getUserById(@Param('id') id: string) {
    const result = await this.service.getUserById({ userId: id });
    return this.util.handleResponse(result);
  }

  @Get('/health')
  @Version('1')
  async healthCheck() {
    const result = await this.service.healthCheck();
    return this.util.handleResponse(result);
  }
}
