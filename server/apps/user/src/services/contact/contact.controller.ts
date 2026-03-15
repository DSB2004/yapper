import { Controller } from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactRequest, BlockContactRequest } from '@yapper/types';
import { GrpcMethod } from '@nestjs/microservices';

@Controller()
export class ContactController {
  constructor(private readonly service: ContactService) {}
  @GrpcMethod('User', 'CreateContact')
  async createContact(payload: CreateContactRequest) {
    return await this.service.createContact(payload);
  }

  @GrpcMethod('User', 'BlockGroup')
  async updateGroup(payload: BlockContactRequest) {
    return await this.service.blockContact(payload);
  }
}
