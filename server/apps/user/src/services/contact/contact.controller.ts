import { Controller } from '@nestjs/common';
import { ContactService } from './contact.service';
import {
  CreateContactRequest,
  BlockContactRequest,
  CheckBlockRequest,
} from '@yapper/types';
import { GrpcMethod } from '@nestjs/microservices';

@Controller()
export class ContactController {
  constructor(private readonly service: ContactService) {}
  @GrpcMethod('User', 'CreateContact')
  async createContact(payload: CreateContactRequest) {
    return await this.service.createContact(payload);
  }

  @GrpcMethod('User', 'BlockContact')
  async blockContact(payload: BlockContactRequest) {
    return await this.service.blockContact(payload);
  }

  @GrpcMethod('User', 'CheckBlockStatus')
  async checkBlockStatus(payload: CheckBlockRequest) {
    return await this.service.checkBlockStatus(payload);
  }
}
