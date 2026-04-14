import { IsString, Length } from 'class-validator';

export class UpsertUserDto {
  @IsString()
  @Length(10, 15)
  firstName!: string;
  @IsString()
  @Length(10, 15)
  lastName!: string;
  @IsString()
  @Length(10, 15)
  avatar!: string;
}
