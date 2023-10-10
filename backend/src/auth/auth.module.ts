import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { SessionSerializer } from './session.serializer';
import { PrismaUserService } from 'src/user/prisma/prismaUser.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { FortyTwoStrategy, JwtStrategy } from './strategy';

@Module({
  imports: [PrismaModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [PrismaUserService, FortyTwoStrategy, JwtStrategy, AuthService, SessionSerializer],
})
export class AuthModule {}

