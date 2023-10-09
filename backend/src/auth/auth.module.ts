import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { FortyTwoStrategy } from './utils/forty_two.strategy';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from './auth.service';

@Module({
  controllers: [AuthController],
  providers: [FortyTwoStrategy, PrismaService, AuthService],
})
export class AuthModule {}

