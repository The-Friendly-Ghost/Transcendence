import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { FortyTwoStrategy } from './utils/forty_two.strategy';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { SessionSerializer } from './session.serializer';
import { PrismaUserService } from 'src/user/prisma/prismaUser.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [PrismaUserService, FortyTwoStrategy, AuthService, SessionSerializer],
})
export class AuthModule {}
