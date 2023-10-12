import { Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';
import { toFileStream } from 'qrcode';
import { Response } from 'express';
import { PrismaTFAService } from './prisma';


@Injectable()
export class TFAService {
    constructor(
        private prisma: PrismaTFAService
    ) { }

    async getOtpauthUrl(stream: Response, name: string, intraId: number) {
        const secret = authenticator.generateSecret();

        await this.prisma.updateTFASecret({ intraId, secret });

        //replace "sietse" with current user and "2FA app name" with env variable
        const otpauthUrl = authenticator.keyuri(name, "2FA app name", secret);
        return toFileStream(stream, otpauthUrl);
    }

    async compareCodeSecret(tfacode: string, intraId: number) {
        const secret = await this.prisma.getTFASecret(intraId);
        console.log("secret in compareCodeSecret:", secret);

        return authenticator.verify({ token: tfacode, secret: String(secret) });
    }
}
