import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import {
  AddUsersToChatroomRequest,
  AddUsersToChatroomResponse,
} from '@yapper/types';
import { Gateway } from './gateway';

@Injectable()
export class GatewayService {
  constructor(private readonly gateway: Gateway) {}

  async addUsersToChatroom(
    data: AddUsersToChatroomRequest,
  ): Promise<AddUsersToChatroomResponse> {
    return await firstValueFrom(this.gateway.service.addUsersToChatroom(data));
  }
}
