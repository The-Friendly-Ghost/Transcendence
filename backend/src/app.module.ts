import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { UserModule } from './user/user.module';
import { PrismaService } from 'prisma/prisma.service';
import { TFAModule } from './2fa/2fa.module';
import { TFAService } from './2fa/2fa.service';
import { PrismaTFAService } from './2fa/prisma';
import { JwtService } from '@nestjs/jwt';
import { GameModule } from './game/game.module';
import { GatewayModule } from './gateway/gateway.modules';
import { ChatModule } from './chat/chat.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [AuthModule, PrismaModule, UserModule, TFAModule, ChatModule, GatewayModule, GameModule, ServeStaticModule.forRoot({
    rootPath: join(__dirname, '..', 'files'),
  }),],
  providers: [PrismaService, TFAService, PrismaTFAService, JwtService],
})
export class AppModule { }
