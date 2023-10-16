import { Module } from '@nestjs/common';
import { TFAController } from './2fa.controller';
import { TFAService } from './2fa.service';
import { PrismaTFAService } from './prisma';
import { PrismaService } from 'prisma/prisma.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { PrismaUserService } from 'src/user/prisma';
import { JwtTFAStrategy } from './strategy';

@Module({
  imports: [JwtModule.register({})],
  controllers: [TFAController],
  providers: [
    TFAService,
    PrismaService,
    PrismaTFAService,
    JwtService,
    UserService,
    PrismaUserService,
    JwtTFAStrategy,
  ],
})
export class TFAModule {}
