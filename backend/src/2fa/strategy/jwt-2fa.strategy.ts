import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@prisma/client';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtTFAStrategy extends PassportStrategy(Strategy, 'jwt-2fa') {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: {
    intraId: number;
    name: string;
    is2faAuthenticated: boolean;
  }): Promise<User> {
    console.log('JwtTFAStrategy.validate payload', payload);
    console.log('JwtTFAStrategy.validate payload.intraId', payload.intraId);
    console.log('JwtTFAStrategy.validate payload.name', payload.name);
    console.log('JwtTFAStrategy.validate payload.is2faAuthenticated', payload.is2faAuthenticated);

    const user: User = await this.userService.getUser(payload.intraId);

    if (!user.twoFAEnabled) {
      console.log('JwtTFAStrategy.validate !user.twoFAEnabled');
      return user;
    }
    if (payload.is2faAuthenticated) {
      console.log('JwtTFAStrategy.validate payload.is2faAuthenticated', payload.is2faAuthenticated);
      return user;
    }
    console.log('JwtTFAStrategy.validate NOT AUTHENTICATED');
    // Instead of raising an error, redirect to the 2fa page!
    throw new UnauthorizedException('Frontend must redirect to 2fa page: /auth/2fa');
  }
}
