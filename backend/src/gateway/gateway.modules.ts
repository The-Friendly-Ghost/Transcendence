import { Module } from '@nestjs/common';
import { ChatController } from 'src/chat/chat.controller';
import { GatewayGateway } from './gateway.gateway';
import { PrismaChatService } from 'src/chat/prisma/prisma_chat.service';
import { PrismaService } from 'prisma/prisma.service';
import { ChatService } from 'src/chat/chat.service';
import { JwtService } from '@nestjs/jwt';
import { GatewayService } from './gateway.service';
import { GatewayController } from './gateway.controller';
import { ChatModule } from 'src/chat/chat.module';

@Module({
  imports: [ChatModule],
  controllers: [GatewayController],
  providers: [GatewayGateway, ChatService, PrismaChatService, PrismaService, JwtService, GatewayService],
})
export class GatewayModule {}
