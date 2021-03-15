import { Injectable, NotFoundException, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { UserRepository } from '../users/user.repository';
import { CreateUserDto } from '../users/dtos/create-user.dto';
import { User } from '../users/user.entity';
import { UserRole } from '../users/user-roles.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { CredentialsDto } from '../users/dtos/credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { randomBytes } from 'crypto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class AuthService {
  constructor(@InjectRepository(UserRepository)
              private userRepository: UserRepository,
              private jwtService: JwtService,
              private mailerService: MailerService,
  ) {
  }

  async singUp(createUserDto: CreateUserDto): Promise<User> {
    if (createUserDto.password != createUserDto.passwordConfirmation) {
      throw new UnprocessableEntityException('Passwords do not match');
    } else {
      const user = await this.userRepository.createUser(
        createUserDto,
        UserRole.USER,
      );

      const mail = {
        to: user.email,
        from: 'noreply@application.com',
        subject: 'Confirmation Email',
        template: 'email-confirmation',
        context: {
          token: user.confirmationToken,
        },
      };
      await this.mailerService.sendMail(mail);
      return user;
    }
  }

  async singIn(credentialsDto: CredentialsDto) {
    const user = await this.userRepository.checkCredentials(credentialsDto);

    if (user === null) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const jwtPayload = {
      id: user.id,
    };

    const token = await this.jwtService.sign(jwtPayload);

    return { token };
  }

  async confirmEmail(confirmationToken: string): Promise<void> {
    const result = await this.userRepository.update(
      { confirmationToken },
      { confirmationToken: null },
    );
    if (result.affected === 0) {
      throw new NotFoundException('Invalid Token');
    }
  }

  async sendRecoveryPasswordEmail(email: string): Promise<void> {
    const user = await this.userRepository.findOne({ email });

    if (!user) {
      throw new NotFoundException('There is not user registered with this email');
    }

    user.recoverToken = randomBytes(32).toString('hex');
    await user.save();

    const mail = {
      to: user.email,
      from: 'noreply@application.com',
      subject: 'Password recovery',
      template: 'recover-password',
      context: {
        token: user.recoverToken,
      },
    };

    await this.mailerService.sendMail(mail);
  }

  async changePassword(id: string, changePasswordDto: ChangePasswordDto):
    Promise<void> {
    const { password, passwordConfirmation } = changePasswordDto;

    if (password != passwordConfirmation) {
      throw new UnprocessableEntityException('Password do not match');
    }

    await this.userRepository.changePassword(id, password);
  }

  async resetPassword(recoverToken: string, changePasswordDto: ChangePasswordDto):
    Promise<void> {
    const user = await this.userRepository.findOne({ recoverToken }, {
      select: ['id'],
    });

    if (!user) {
      throw new NotFoundException('Invalid Token');
    }

    try {
      await this.changePassword(user.id.toString(), changePasswordDto);
    } catch (error) {
      throw error;
    }
  }
}
