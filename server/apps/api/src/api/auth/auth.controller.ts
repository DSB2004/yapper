import {
  Body,
  Controller,
  Get,
  Post,
  Version,
  HttpException,
  HttpCode,
} from '@nestjs/common';
import { LoginDto, ValidateUserDto, VerifyDto, ResendOtpDto } from './auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  private handleResponse(result: any) {
    const { status, ...rest } = result;
    const responseBody = { ...rest };
    if (status >= 400) {
      throw new HttpException(responseBody, status);
    }
    return responseBody;
  }

  @Post('login')
  @Version('1')
  @HttpCode(200)
  async login(@Body() data: LoginDto) {
    const result = await this.service.loginUser(data);
    return this.handleResponse(result);
  }

  @Post('verify')
  @Version('1')
  @HttpCode(200)
  async verify(@Body() data: VerifyDto) {
    const result = await this.service.verifyUser(data);
    return this.handleResponse(result);
  }

  @Post('resend')
  @Version('1')
  @HttpCode(200)
  async resendOtp(@Body() data: ResendOtpDto) {
    const result = await this.service.resendOtp(data);
    return this.handleResponse(result);
  }

  @Post('validate')
  @Version('1')
  @HttpCode(200)
  async validateUser(@Body() data: ValidateUserDto) {
    const result = await this.service.validateUser(data);
    return this.handleResponse(result);
  }

  @Get('health')
  @Version('1')
  async healthCheck() {
    const result = await this.service.healthCheck();
    return this.handleResponse(result);
  }
}
