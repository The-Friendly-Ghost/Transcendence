import { Module } from '@nestjs/common';
// import { ChatGateway } from './chat.gateway';
import { ChatController } from './chat.controller';
import { PrismaChatService } from './prisma';
import { PrismaService } from 'prisma/prisma.service';
import { ChatService } from './chat.service';
import { JwtService } from '@nestjs/jwt';
import { GatewayService } from 'src/gateway/gateway.service';

@Module({
  imports: [],
  controllers: [ChatController],
  providers: [PrismaChatService, PrismaService, ChatService, JwtService, GatewayService],
})
export class ChatModule {}
