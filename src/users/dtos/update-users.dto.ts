import { IsEmail, IsOptional, IsString } from 'class-validator';
import { UserRole } from '../user-roles.enum';

export class UpdateUsersDto {
  @IsOptional()
  @IsString({
    message: 'Enter valid username',
  })
  name: string;

  @IsOptional()
  @IsEmail({}, {
    message: 'Enter valid email',
  })
  email: string;

  @IsOptional()
  role: UserRole;

  @IsOptional()
  status: boolean;
}