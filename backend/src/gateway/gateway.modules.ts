import { Module } from '@nestjs/common';
import { ChatController } from 'src/chat/chat.controller';
import { GatewayGateway } from './gateway';
import { PrismaChatService } from 'src/chat/prisma/prisma_chat.service';
import { PrismaService } from 'prisma/prisma.service';
import { ChatService } from 'src/chat/chat.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [],
  controllers: [ChatController],
  providers: [GatewayGateway, PrismaChatService, PrismaService, ChatService, JwtService],
})
export class GatewayModule {}
