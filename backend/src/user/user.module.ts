import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaModule } from 'prisma/prisma.module';
import { PrismaUserService } from './prisma/prismaUser.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [PrismaClient, PrismaModule],
  providers: [PrismaUserService, UserService],
  controllers: [UserController],
  exports: [PrismaUserService],
})
export class UserModule {}
