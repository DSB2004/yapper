import { Injectable } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { db } from 'src/lib/db';
import {
  LoginRequest,
  LoginResponse,
  VerifyRequest,
  VerifyResponse,
  ResendOtpRequest,
  ResendOtpResponse,
  ValidateUserRequest,
  ValidateUserResponse,
  HealthCheckResponse,
  UserTokenType,
} from '@yapper/types';

import { OtpService } from '../../utils/otp/otp.service';
import { JwtService } from '../../utils/jwt/jwt.service';
import { createId } from '@paralleldrive/cuid2';

@Injectable()
export class AuthService {
  constructor(
    private readonly otp: OtpService,
    private readonly jwt: JwtService,
  ) {}

  async loginUser(payload: LoginRequest): Promise<LoginResponse> {
    try {
      const { phone } = payload;

      await db.auth.upsert({
        where: { phone },
        create: { phone, publicId: `auth_${createId()}` },
        update: {},
      });

      const { message, success } = await this.otp.sendOTP({ phone });

      return {
        message,
        success,
        status: success ? 200 : 400,
      };
    } catch {
      return {
        status: 500,
        success: false,
        message: 'Internal Server Error',
      };
    }
  }

  async verifyUser(payload: VerifyRequest): Promise<VerifyResponse> {
    const { otp } = payload;

    try {
      const { message, phone, success } = await this.otp.verifyOTP(otp);

      if (!success || !phone) {
        return {
          status: 401,
          message,
          success,
        };
      }

      const user = await db.auth.findUnique({ where: { phone } });

      if (!user) {
        return {
          status: 404,
          message: 'Account not found',
          success: false,
        };
      }

      const accessToken = this.jwt.generateJWT({
        type: 'access',
        phone,
        authId: user.publicId,
      });

      const refreshToken = this.jwt.generateJWT(
        {
          type: 'refresh',
          phone,
          authId: user.publicId,
        },
        '30d',
      );

      return {
        status: 200,
        message: 'User verified',
        success: true,
        accessToken,
        refreshToken,
      };
    } catch (err) {
      console.log(err);
      return {
        status: 500,
        message: 'Internal Server Error',
        success: false,
      };
    }
  }

  async resendOtp(payload: ResendOtpRequest): Promise<ResendOtpResponse> {
    try {
      const { phone } = payload;

      const user = await db.auth.findUnique({ where: { phone } });

      if (!user) {
        return {
          status: 404,
          success: false,
          message: 'User not found',
        };
      }

      const { message, success } = await this.otp.sendOTP({ phone });

      return {
        message: success ? 'OTP resent successfully' : message,
        success,
        status: success ? 200 : 400,
      };
    } catch {
      return {
        status: 500,
        success: false,
        message: 'Internal Server Error',
      };
    }
  }

  async validateUser(
    payload: ValidateUserRequest,
  ): Promise<ValidateUserResponse> {
    try {
      const { accessToken, refreshToken } = payload;
      let decoded: UserTokenType | null = null;

      decoded = await this.jwt.validateToken<UserTokenType>(accessToken);

      if (!decoded) {
        decoded = await this.jwt.validateToken<UserTokenType>(refreshToken);
      }

      if (!decoded)
        return {
          status: 401,
          success: false,
          message: 'Session expired. Please login',
        };

      const user = await db.auth.findUnique({
        where: { publicId: decoded.authId },
      });

      if (!user) {
        return {
          status: 404,
          success: false,
          message: 'User not found',
        };
      }

      const newAccessToken = this.jwt.generateJWT({
        type: 'access',
        phone: user.phone,
        authId: user.publicId,
      });

      const newRefreshToken = this.jwt.generateJWT(
        {
          type: 'refresh',
          phone: user.phone,
          authId: user.publicId,
        },
        '30d',
      );

      return {
        status: 200,
        success: true,
        message: 'User validated',
        authId: user.publicId,
        phone: user.phone,
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch {
      return {
        status: 500,
        success: false,
        message: 'Internal Server Error',
      };
    }
  }
}
