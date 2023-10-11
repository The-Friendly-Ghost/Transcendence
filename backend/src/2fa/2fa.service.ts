import { Injectable } from '@nestjs/common';
import { authenticator } from 'otplib'
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TFAService {
    constructor(
        private prisma: PrismaService
    ) {}
    
    public async makeTFASecret() {
        const secret = authenticator.generateSecret();

        //replace "sietse" with current user and "2FA app name" with env variable
        const otpauthUrl = authenticator.keyuri("sietse", "2FA app name", secret);
        
    }

}
