import { Injectable } from '@nestjs/common';
import { Auth } from './auth';
import { ValidateUserRequest, ValidateUserResponse } from '@yapper/types';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(private readonly auth: Auth) {}

  async validateUser(data: ValidateUserRequest): Promise<ValidateUserResponse> {
    return await firstValueFrom(this.auth.service.validateUser(data));
  }
}
