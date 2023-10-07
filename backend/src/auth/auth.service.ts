import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async validateUser(intraId: number, name: string): Promise<any> {
    console.log('AuthService.validateUser');
    console.log('intraId: ', intraId);
    console.log('name: ', name);

    // Do some stuff to add the user to the database if needed

    return name;
  }

  async login(intraId: number, name: string): Promise<{ access_token: string }> {
    console.log('AuthService.signToken');

    const payload = { intraId: intraId, name: name };
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: '8h',
      secret: process.env.JWT_SECRET,
    });
    return { access_token: token };
  }
}
