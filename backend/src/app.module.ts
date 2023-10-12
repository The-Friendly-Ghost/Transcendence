import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { TFAService } from './2fa/2fa.service';
import { TFAModule } from './2fa/2fa.module';
import { PrismaTFAService } from './2fa/prisma';

@Module({
  imports: [AuthModule, PrismaModule, UserModule, TFAModule],
  providers: [PrismaService, TFAService, PrismaTFAService],
})
export class AppModule {}
