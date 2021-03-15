import {
  Body,
  Controller, Delete,
  ForbiddenException,
  Get,
  Param,
  Put,
  Post, Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { ReturnUserDto } from './dtos/return-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Role } from '../auth/role.decorator';
import { UserRole } from './user-roles.enum';
import { UpdateUsersDto } from './dtos/update-users.dto';
import { GetUser } from '../auth/get-user.decorator';
import { User } from './user.entity';
import { throwError } from 'rxjs';
import { FindUsersQueryDto } from './dtos/find-users-query.dto';

@Controller('users')
@UseGuards(AuthGuard(), RolesGuard)
export class UsersController {
  constructor(private usersService: UsersService) {
  }

  @Post()
  @Role(UserRole.ADMIN)
  @UseGuards(AuthGuard(), RolesGuard)
  async createAdminUser(@Body(ValidationPipe) createUserDto: CreateUserDto): Promise<ReturnUserDto> {
    const user = await this.usersService.createAdminUser(createUserDto);
    return {
      user,
      message: 'Administrador cadastrado com sucesso',
    };
  }

  @Get(':id')
  @Role(UserRole.ADMIN)
  async findUserById(@Param('id') id): Promise<ReturnUserDto> {
    const user = await this.usersService.findUserById(id);
    return {
      user,
      message: 'Usuário encontrado',
    };
  }

  @Put(':id')
  async updateUser(
    @Body(ValidationPipe) updateUserDto: UpdateUsersDto,
    @GetUser() user: User,
    @Param('id') id: string,
  ) {
    if (user.role != UserRole.ADMIN && user.id.toString() != id) {
      throw new ForbiddenException('Vocẽ não tem autorização para acessar esse recurso');
    } else {
      return this.usersService.updateUser(updateUserDto, id);
    }
  }

  @Delete(':id')
  @Role(UserRole.ADMIN)
  async deleteUser(@Param('id') id: string) {
    await this.usersService.deleteUser(id);
    return {
      message: 'Usuário removido com sucesso',
    };
  }

  @Get()
  @Role(UserRole.ADMIN)
  async findUsers(@Query() query: FindUsersQueryDto) {
    const found = await this.usersService.findUsers(query);

    return {
      found, message: 'Usuários encontrados',
    };
  }
}
