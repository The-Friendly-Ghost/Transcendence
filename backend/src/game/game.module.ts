import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { PrismaClient } from '@prisma/client';
import { PrismaModule } from 'prisma/prisma.module';
import { PrismaGameService } from './prisma/prismaGame.service';
import { GameGateway } from './game.gateway';
import { PrismaChatService } from 'src/chat/prisma';
import { GatewayModule } from 'src/gateway/gateway.module';

@Module({
  imports: [PrismaClient, PrismaModule, GatewayModule],
  providers: [GameService, PrismaGameService, GameGateway, PrismaChatService],
  controllers: [GameController],
  exports: [PrismaGameService],
})
export class GameModule { }
