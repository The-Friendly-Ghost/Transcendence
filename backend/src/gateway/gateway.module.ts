import { Module, forwardRef } from '@nestjs/common';
import { ChatController } from 'src/chat/chat.controller';
import { GatewayGateway } from './gateway.gateway';
import { PrismaChatService } from 'src/chat/prisma/prisma_chat.service';
import { PrismaService } from 'prisma/prisma.service';
import { ChatService } from 'src/chat/chat.service';
import { JwtService } from '@nestjs/jwt';
import { GatewayService } from './gateway.service';
import { GatewayController } from './gateway.controller';
import { ChatModule } from 'src/chat/chat.module';
import { PrismaModule } from 'prisma/prisma.module';
import { GameModule } from 'src/game/game.module';

@Module({
  imports: [PrismaModule],
  controllers: [GatewayController],
  exports: [GatewayService, GatewayGateway],
  providers: [GatewayGateway, JwtService, GatewayService, PrismaChatService],
})
export class GatewayModule {}
