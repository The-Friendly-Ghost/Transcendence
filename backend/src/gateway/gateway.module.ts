import { Module } from '@nestjs/common';
import { GatewayGateway } from './gateway.gateway';
import { PrismaChatService } from 'src/chat/prisma/prisma_chat.service';
import { JwtService } from '@nestjs/jwt';
import { GatewayService } from './gateway.service';
import { GatewayController } from './gateway.controller';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [GatewayController],
  exports: [GatewayService, GatewayGateway],
  providers: [GatewayGateway, JwtService, GatewayService, PrismaChatService],
})
export class GatewayModule {}
