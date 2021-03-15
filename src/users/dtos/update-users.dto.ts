import { IsEmail, IsOptional, IsString } from 'class-validator';
import { UserRole } from '../user-roles.enum';

export class UpdateUsersDto {
  @IsOptional()
  @IsString({
    message: 'Informe um nome de usuário válido',
  })
  name: string;

  @IsOptional()
  @IsEmail({}, {
    message: 'Informe um endereço de email válido',
  })
  email: string;

  @IsOptional()
  role: UserRole;

  @IsOptional()
  status: boolean;
}