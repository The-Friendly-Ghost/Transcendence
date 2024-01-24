import { Module } from '@nestjs/common';
// import { ChatGateway } from './chat.gateway';
import { ChatController } from './chat.controller';
import { PrismaChatService } from './prisma';
import { PrismaService } from 'prisma/prisma.service';
import { ChatService } from './chat.service';
import { JwtService } from '@nestjs/jwt';
// import { GatewayService } from 'src/gateway/gateway.service';
import { GatewayModule } from 'src/gateway/gateway.module';

@Module({
  imports: [GatewayModule],
  controllers: [ChatController],
  exports: [ChatService],
  providers: [PrismaChatService, PrismaService, ChatService, JwtService],
})
export class ChatModule {}
