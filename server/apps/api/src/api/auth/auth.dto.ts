import { IsString, Length } from 'class-validator';

export class LoginDto {
  @IsString()
  @Length(10, 15)
  phone!: string;
}

export class VerifyDto {
  @IsString()
  phone!: string;

  @IsString()
  @Length(6, 6)
  otp!: string;
}

export class ResendOtpDto {
  @IsString()
  phone!: string;
}

export class ValidateUserDto {
  @IsString()
  accessToken!: string;

  @IsString()
  refreshToken!: string;
}
