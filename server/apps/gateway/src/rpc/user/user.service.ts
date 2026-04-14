import { Injectable } from '@nestjs/common';
import { User } from './user';
import { GetUserRequest, GetUserResponse } from '@yapper/types';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UserService {
  constructor(private readonly user: User) {}

  async getUser(data: GetUserRequest): Promise<GetUserResponse> {
    return await firstValueFrom(this.user.service.getUser(data));
  }
}
