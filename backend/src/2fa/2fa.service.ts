import { Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';
import { toFileStream } from 'qrcode';
import { Response } from 'express';
import { PrismaTFAService } from './prisma';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TFAService {
  constructor(
    private prisma: PrismaTFAService,
    private readonly jwtService: JwtService,
  ) {}

  async getOtpauthUrl(stream: Response, name: string, intraId: number): Promise<void> {
    console.log('TFAService.getOtpauthUrl');
    const secret = authenticator.generateSecret();

    await this.prisma.updateTFASecret({ intraId, secret });

    //replace "sietse" with current user and "2FA app name" with env variable
    const otpauthUrl = authenticator.keyuri(name, '2FA app name', secret);
    return await toFileStream(stream, otpauthUrl);
  }

  async compareCodeSecret(tfacode: string, intraId: number): Promise<boolean> {
    console.log('TFAService.compareCodeSecret');

    const secret = await this.prisma.getTFASecret(intraId);
    console.log('secret in compareCodeSecret:', secret);

    return authenticator.verify({ token: tfacode, secret: String(secret) });
  }

  async isTFAEnabled(intraId: number): Promise<boolean> {
    console.log('TFAService.isTFAEnabled');
    return await this.prisma.getTwoFAEnabled(intraId);
  }

  async login(
    intraId: number,
    name: string,
    isCodeValid: boolean,
  ): Promise<{ access_token: string }> {
    console.log('TFAService.login');
    console.log('intraId: ', intraId);
    console.log('iscoeValid: ', isCodeValid);

    const payload = { intraId: intraId, name: name, is2faAuthenticated: isCodeValid };
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: '8h',
      secret: process.env.JWT_SECRET,
    });

    console.log('TFAService.login returning token');
    return { access_token: token };
  }
}
