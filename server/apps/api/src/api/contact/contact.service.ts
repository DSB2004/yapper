import { Injectable } from '@nestjs/common';
import { Contact } from './contact';
import {
  BlockContactRequest,
  BlockContactResponse,
  CreateContactRequest,
  CreateContactResponse,
} from '@yapper/types';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ContactService {
  constructor(private readonly contact: Contact) {}

  async createContact(
    data: CreateContactRequest,
  ): Promise<CreateContactResponse> {
    return await firstValueFrom(this.contact.service.createContact(data));
  }
  async blockContact(data: BlockContactRequest): Promise<BlockContactResponse> {
    return await firstValueFrom(this.contact.service.blockContact(data));
  }
}
