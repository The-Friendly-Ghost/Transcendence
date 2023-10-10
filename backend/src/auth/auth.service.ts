import { JwtService } from '@nestjs/jwt';
import { PrismaUserService } from 'src/user/prisma/prismaUser.service';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

@Injectable({})
export class AuthService {
  constructor(
    private readonly prismaUserService: PrismaUserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(intraId: number, name: string): Promise<Object> {
    console.log('AuthService.validateUser');
    console.log('intraId: ', intraId);
    console.log('name: ', name);

    // Do some stuff to add the user to the database if needed
    const user: User = await this.prismaUserService.insertOrUpdateUsername({ intraId, name });

    console.log('AuthService.validateUser returning user:', user);
    return { intraId: user.intraId, name: user.name };
  }

  async login(intraId: number, name: string): Promise<{ access_token: string }> {
    console.log('AuthService.signToken');
    console.log('intraId: ', intraId);

    const payload = { intraId: intraId, name: name };
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: '8h',
      secret: process.env.JWT_SECRET,
    });

    console.log('AuthService.signToken returning token');
    return { access_token: token };
  }
}
