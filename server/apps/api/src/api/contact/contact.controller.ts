import {
  Body,
  Controller,
  HttpCode,
  Param,
  Patch,
  Put,
  Req,
  Version,
} from '@nestjs/common';
import { ContactService } from './contact.service';
import { CommonService } from 'src/utils/common/common.service';
import { BlockContactDto, CreateContactDto } from './contact.dto';
import { CurrentUser } from 'src/types';

@Controller('contact')
export class ContactController {
  constructor(
    private readonly service: ContactService,
    private readonly util: CommonService,
  ) {}

  @Put('')
  @Version('1')
  @HttpCode(200)
  async createContact(@Body() data: CreateContactDto, @CurrentUser() user) {
    const { authId } = user;
    console.log({ ...data, authId });
    const result = await this.service.createContact({ ...data, authId });
    return this.util.handleResponse(result);
  }

  @Patch('block')
  @Version('1')
  @HttpCode(200)
  async blockContact(@Body() data: BlockContactDto, @CurrentUser() user) {
    const { authId } = user;
    const { contactUserId } = data;
    const result = await this.service.blockContact({ contactUserId, authId });
    return this.util.handleResponse(result);
  }
}
