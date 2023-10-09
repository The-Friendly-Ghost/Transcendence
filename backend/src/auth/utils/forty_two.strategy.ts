import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
  constructor() {
    super({
      clientID: process.env.FORTYTWO_CLIENT_ID,
      clientSecret: process.env.FORTYTWO_CLIENT_SECRET,
      callbackURL: `http://${process.env.BACKEND_HOST}:${process.env.BACKEND_PORT}/auth/callback`,
      // callbackURL: 'http://localhost:3000/auth/callback', // This url is used for now, but should be changed to the one above
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any): Promise<any> {
    console.log('accasToken', accessToken);
    console.log('refreshToken', refreshToken);
    console.log('profile', profile);

    return profile.login;
  }
}
