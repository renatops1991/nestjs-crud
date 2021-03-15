import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../users/user.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@InjectRepository(UserRepository)
              private userRepository: UserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'super-secret',
    });
  }

  async validate(payload: { id: number }) {
    const { id } = payload;
    const user = await this.userRepository.findOne(id, {
      select: ['name', 'email', 'status', 'role', 'id'],
    });

    if (!user) {
      throw new UnauthorizedException('User not foudn');
    }

    return user;
  }
}