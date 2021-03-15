import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UnauthorizedException,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dtos/create-user.dto';
import { CredentialsDto } from '../users/dtos/credentials.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../users/user.entity';
import { GetUser } from './get-user.decorator';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UserRole } from '../users/user-roles.enum';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {
  }

  @Post('/signup')
  async singUp(@Body(ValidationPipe) createUserDto: CreateUserDto):
    Promise<{ message: string }> {
    await this.authService.singUp(createUserDto);

    return {
      message: 'Registration done',
    };
  }

  @Post('/signin')
  @ApiBody({ type: CredentialsDto })
  @ApiResponse({status: 201, description: '{ "token": "token-access-response"}'})
  @ApiResponse({status: 401, description: 'Invalid credentials'})
  async singIn(@Body(ValidationPipe) credentialsDto: CredentialsDto):
    Promise<{ token: string }> {
    return await this.authService.singIn(credentialsDto);
  }

  @Put(':token')
  async confirmEmail(@Param('token') token: string) {
    const user = await this.authService.confirmEmail(token);
    return {
      message: 'Verified Email',
    };
  }

  @Post('/send-recovery-email')
  async sendRecoveryPasswordEmail(@Body('email') email: string,
  ): Promise<{ message: string }> {
    await this.authService.sendRecoveryPasswordEmail(email);
    return {
      message: 'An email has been sent with instructions to reset your password',
    };
  }

  @Put('/reset-password/:token')
  async resetPassword(
    @Param('token') token: string,
    @Body(ValidationPipe) changePasswordDto: ChangePasswordDto):
    Promise<{ message: string }> {
    await this.authService.resetPassword(token, changePasswordDto);

    return {
      message: 'Password updated successfully',
    };
  }

  @Put(':id/change-password')
  @UseGuards(AuthGuard())
  async changePassword(
    @Param('id') id: string,
    @Body(ValidationPipe) changePasswordDto: ChangePasswordDto,
    @GetUser() user: User) {
    if (user.role != UserRole.ADMIN && user.id.toString() !== id) {
      throw new UnauthorizedException('Your not allowed to perform this operation');
    }

    await this.authService.changePassword(id, changePasswordDto);
    return {
      message: 'Updated Password',
    };
  }

  @Get('/me')
  @UseGuards(AuthGuard())
  getMe(@GetUser() user: User): User {
    return user;
  }
}
