import { Module } from '@nestjs/common';
import { TFAController } from './2fa.controller';
import { TFAService } from './2fa.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaTFAService } from './prisma';

@Module({
    controllers: [TFAController],
    providers: [TFAService, PrismaService, PrismaTFAService],
})
export class TFAModule { }
