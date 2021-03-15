import { Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { UserRepository } from '../users/user.repository';
import { CreateUserDto } from '../users/dtos/create-user.dto';
import { User } from '../users/user.entity';
import { UserRole } from '../users/user-roles.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { CredentialsDto } from '../users/dtos/credentials.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(@InjectRepository(UserRepository)
              private userRepository: UserRepository,
              private jwtService: JwtService) {
  }

  async singUp(createUserDto: CreateUserDto): Promise<User> {
    if (createUserDto.password != createUserDto.passwordConfirmation) {
      throw new UnprocessableEntityException('As senhas não conferem');
    } else {
      return await this.userRepository.createUser(createUserDto, UserRole.USER);
    }
  }

  async singIn(credentialsDto: CredentialsDto){
    const user = await this.userRepository.checkCredentials(credentialsDto);

    if(user === null){
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const jwtPayload = {
      id: user.id
    };

    const token = await this.jwtService.sign(jwtPayload);

    return {token};
  }
}
