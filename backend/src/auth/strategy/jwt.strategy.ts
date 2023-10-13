import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaUserService } from 'src/user/prisma/prismaUser.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prismaUserService: PrismaUserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: { intraId: number }) {
    console.log('JwtStrategy.validate payload', payload.intraId);

    const user = await this.prismaUserService.findUser({ intraId: payload.intraId });
    if (!user) {
      return null;
    }

    return user;
  }
}
