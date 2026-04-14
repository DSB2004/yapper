import { IsString, Length, IsArray } from 'class-validator';

export class CreateContactDto {
  @IsString()
  @Length(10, 15)
  firstName!: string;

  @IsString()
  @Length(10, 15)
  lastName!: string;

  @IsString()
  @Length(10, 15)
  phone!: string;
}
