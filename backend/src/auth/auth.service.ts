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

  async validateUser(intraId: number, name: string, image_url: string): Promise<Object> {
    console.log('AuthService.validateUser');
    console.log('intraId: ', intraId);
    console.log('name: ', name);
    console.log('image_url: ', image_url);

    // Do some stuff to add the user to the database if needed
    const user: User = await this.prismaUserService.firstInsertUsername({
      intraId,
      name,
      image_url,
    });

    console.log('AuthService.validateUser returning user:', user);
    return { intraId: user.intraId, name: user.name };
  }

  async login(intraId: number, name: string): Promise<{ access_token: string }> {
    // TODO: Add 2fa
    // 1. Check if the user has 2fa enabled
    // 2. If not, sign the token
    // 3. Else If so, ask for the 2fa code
    // 3.1 If the code is correct, sign the token

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
