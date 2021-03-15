import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './user.entity';
import { UserRole } from './user-roles.enum';
import { UpdateUsersDto } from './dtos/update-users.dto';
import { FindUsersQueryDto } from './dtos/find-users-query.dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(UserRepository) private userRepository: UserRepository) {
  }

  async createAdminUser(createUserDto: CreateUserDto): Promise<User> {
    if (createUserDto.password != createUserDto.passwordConfirmation) {
      throw new UnprocessableEntityException('Passwords do not match');
    }

    return this.userRepository.createUser(createUserDto, UserRole.ADMIN);

  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    if (createUserDto.password != createUserDto.passwordConfirmation) {
      throw new UnprocessableEntityException('Passwords do not match');
    }

    return this.userRepository.createUser(createUserDto, UserRole.USER);
  }

  async findUserById(userId: string): Promise<User> {
    const user = await this.userRepository.findOne(userId, {
      select: ['email', 'name', 'role', 'id'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  /* Antigo não testavel
    async updateUser(updateUserDto: UpdateUsersDto, id: string): Promise<User> {
      const user = await this.findUserById(id);
      const { name, email, role, status } = updateUserDto;
      user.name = name ? name : user.email;
      user.email = email ? email : user.email;
      user.role = role ? role : user.role;
      user.status = status === undefined ? user.status : status;

      try {
        await user.save();
        return user;
      } catch (error) {
        throw new InternalServerErrorException('Error saving data to the database');
      }
    }*/

  async updateUser(updateUserDto: UpdateUsersDto, id: string) {
    const result = await this.userRepository.update({ id }, updateUserDto);

    if (result.affected < 1) {
      throw new NotFoundException('User not found');
    }

    const user = await this.findUserById(id);
    return user;
  }

  async deleteUser(userId: string) {
    const result = await this.userRepository.delete({ id: userId });
    if (result.affected === 0) {
      throw new NotFoundException('User not found');
    }
  }

  async findUsers(queryDto: FindUsersQueryDto): Promise<{ users: User[]; total: number }> {
    const users = await this.userRepository.findUsers(queryDto);
    return users;
  }
}
