import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import {
  GetUsersResponse,
  GetUsersRequest,
  CheckBlockRequest,
  CheckBlockResponse,
} from '@yapper/types';
import { User } from './user';

@Injectable()
export class UserService {
  constructor(private readonly user: User) {}

  async getUsers(data: GetUsersRequest): Promise<GetUsersResponse> {
    return await firstValueFrom(this.user.service.getUsers(data));
  }
  async checkBlockStatus(data: CheckBlockRequest): Promise<CheckBlockResponse> {
    return await firstValueFrom(this.user.service.checkBlockStatus(data));
  }
}
