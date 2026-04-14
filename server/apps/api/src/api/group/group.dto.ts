import { IsString, Length, IsArray } from 'class-validator';

export class CreateGroupDto {
  @IsString()
  @Length(10, 15)
  name!: string;

  @IsString()
  @Length(10, 15)
  description!: string;

  @IsString()
  @Length(10, 15)
  icon!: string;

  @IsArray()
  @IsString({ each: true })
  members!: string[];
}

export class UpdateGroupDto {
  @IsString()
  @Length(10, 15)
  groupId!: string;

  @IsString()
  @Length(10, 15)
  name!: string;

  @IsString()
  @Length(10, 15)
  description!: string;

  @IsString()
  @Length(10, 15)
  icon!: string;
}

export class AddGroupMemberDto {
  @IsString()
  @Length(10, 15)
  groupId!: string;

  @IsArray()
  @IsString({ each: true })
  members!: string[];
}

export class RemoveGroupMemberDto {
  @IsString()
  @Length(10, 15)
  groupId!: string;

  @IsArray()
  @IsString({ each: true })
  members!: string[];
}

export class LeaveGroupDto {
  @IsString()
  @Length(10, 15)
  groupId!: string;
}
