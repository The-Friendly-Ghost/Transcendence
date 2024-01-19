import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@prisma/client';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/user/user.service';
import * as fs  from 'fs';

@Injectable()
export class JwtTFAStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: { intraId: number; name: string; TfaValidated: boolean }): Promise<User> {
    console.log('JwtTFAStrategy.validate payload', payload);
    console.log('JwtTFAStrategy.validate payload.intraId', payload.intraId);
    console.log('JwtTFAStrategy.validate payload.name', payload.name);
    console.log('JwtTFAStrategy.validate payload.TfaValidated', payload.TfaValidated);
///home/svos/Documents/transcendence/backend/files/default_avatar/default_avatar.jpeg
// , (err, data) => {console.log(data)}
    // const data = fs.readFileSync("/home/svos/Documents/transcendence/backend/src/2fa/strategy/index.ts");
    // console.log('jwt 2fa strategy validate - data:', data);
    // await this.userService.setAvatar(payload.intraId, data);
    const user: User = await this.userService.getUser(payload.intraId);
    return user;

    // if (!user.twoFAEnabled) {
    //   console.log('JwtTFAStrategy.validate !user.twoFAEnabled');
    //   return user;
    // }
    // if (payload.is2faAuthenticated) {
    //   console.log('JwtTFAStrategy.validate payload.is2faAuthenticated', payload.is2faAuthenticated);
    //   return user;
    // }
    // console.log('JwtTFAStrategy.validate NOT AUTHENTICATED');
    // // Instead of raising an error, redirect to the 2fa page!
    // throw new UnauthorizedException('Frontend must redirect to 2fa page: /auth/2fa');
  }
}
