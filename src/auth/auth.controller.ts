import { Body, Controller, Get, Post, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dtos/create-user.dto';
import { CredentialsDto } from '../users/dtos/credentials.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../users/user.entity';
import { GetUser } from './get-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {
  }

  @Post('/signup')
  async singUp(@Body(ValidationPipe) createUserDto: CreateUserDto): Promise<{ message: string }> {
    await this.authService.singUp(createUserDto);

    return {
      message: 'Cadastro realizado com sucesso',
    };
  }

  @Post('/signin')
  async singIn(@Body(ValidationPipe) credentialsDto: CredentialsDto): Promise<{ token: string }> {
    return await this.authService.singIn(credentialsDto);
  }

  @Get('/me')
  @UseGuards(AuthGuard())
  getMe(@GetUser() user: User): User {
    return user;
  }
}
