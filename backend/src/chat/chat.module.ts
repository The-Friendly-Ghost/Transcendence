import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatController } from './chat.controller';
import { PrismaChatService } from './prisma';
import { PrismaService } from 'prisma/prisma.service';
import { ChatService } from './chat.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [],
  controllers: [ChatController],
  providers: [ChatGateway, PrismaChatService, PrismaService, ChatService, JwtService],
})
export class ChatModule {}
