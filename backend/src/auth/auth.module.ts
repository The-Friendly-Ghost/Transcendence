import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { SessionSerializer } from './session.serializer';
import { PrismaUserService } from 'src/user/prisma/prismaUser.service';
import { PrismaModule } from 'prisma/prisma.module';
import { FortyTwoStrategy } from './strategy';
import { UserService } from 'src/user/user.service';
import { TFAService } from 'src/2fa/2fa.service';
import { PrismaTFAService } from 'src/2fa/prisma';

@Module({
  imports: [PrismaModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    PrismaUserService,
    PrismaTFAService,
    UserService,
    FortyTwoStrategy,
    AuthService,
    SessionSerializer,
    TFAService,
  ],
})
export class AuthModule {}
