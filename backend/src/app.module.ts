import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { UserModule } from './user/user.module';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  imports: [AuthModule, PrismaModule, UserModule],
  providers: [PrismaService],
})
export class AppModule {}
