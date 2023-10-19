import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { PrismaClient } from '@prisma/client';
import { PrismaModule } from 'prisma/prisma.module';
import { PrismaGameService } from './prisma/prismaGame.service';

@Module({
  imports: [PrismaClient, PrismaModule],
  providers: [GameService, PrismaGameService],
  controllers: [GameController],
  exports: [PrismaGameService],
})
export class GameModule {}
