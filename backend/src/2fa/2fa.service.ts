import { Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';
import { toFileStream } from 'qrcode';
import { Response } from 'express';
import { PrismaTFAService } from './prisma';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class TFAService {
  constructor(
    private prisma: PrismaTFAService,
    private readonly jwtService: JwtService,
    private user: UserService,
  ) {}

// if needed to revert this funciton to show qr use this:
//name: string, stream: Response, 
  async get_secret(intraId: number): Promise<string> {
    const secret = authenticator.generateSecret();
    const user = await this.user.getUser(intraId);
    if (!user) throw new Error('User not found');
    await this.prisma.updateTFASecret({ intraId, secret });
    //replace "sietse" with current user and "2FA app name" with env variable
    // const otpauthUrl = authenticator.keyuri(name, '2FA app name', secret);
    // return await toFileStream(stream, otpauthUrl);
    return secret;
  }

  async toggle_2fa(intraId: number): Promise<any> {
    console.log('TFAService.enable_2fa');
    const is2faEnabled = await this.prisma.getTwoFAEnabled(intraId).catch((e: Error) => {return "wrong intraId"});
    if (is2faEnabled) {
      return await this.prisma.toggle_tfa(intraId, false);
    }
    return await this.prisma.toggle_tfa(intraId, true);
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
