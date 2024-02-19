import { Module, forwardRef } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { PrismaClient } from '@prisma/client';
import { PrismaModule } from 'prisma/prisma.module';
import { PrismaGameService } from './prisma/prismaGame.service';
// import { GameGateway } from './game.gateway';
import { PrismaChatService } from 'src/chat/prisma';
import { GatewayModule } from 'src/gateway/gateway.module';
import { UserModule } from 'src/user/user.module';
import { InviteService } from './invite.service';
import { QueueService } from './queue.service';

@Module({
  imports: [PrismaClient, PrismaModule, GatewayModule, UserModule],
  providers: [GameService, QueueService, PrismaGameService, PrismaChatService, InviteService],
  controllers: [GameController],
  exports: [GameService, PrismaGameService],
})
export class GameModule { }
