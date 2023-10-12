import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';
import { AuthService } from '../auth.service';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
  constructor(private readonly AuthService: AuthService) {
    super({
      clientID: process.env.FORTYTWO_CLIENT_ID,
      clientSecret: process.env.FORTYTWO_CLIENT_SECRET,
      callbackURL: `http://${process.env.BACKEND_HOST}:${process.env.BACKEND_PORT}/auth/callback`,
      // callbackURL: 'http://localhost:3000/auth/callback', // This url is used for now, but should be changed to the one above
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any): Promise<any> {
    console.log('FortyTwoStrategy.validate');
    console.log('accasToken', accessToken);
    console.log('refreshToken', refreshToken);
    console.log('profile.id', profile.id);
    console.log('profile.username', profile.username);
    console.log('profile.image', profile._json.image.versions.small);

    const user = await this.AuthService.validateUser(
      Number(profile.id),
      profile.username,
      profile._json.image.versions.small,
    );
    if (!user) {
      throw new UnauthorizedException();
    }

    console.log('FortyTwoStrategy.validate returning user');
    return user;
  }
}
