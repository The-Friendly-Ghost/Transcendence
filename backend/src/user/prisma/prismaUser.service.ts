import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User, Prisma } from '@prisma/client';

@Injectable()
export class PrismaUserService {
  constructor(private prisma: PrismaService) {}

  async findOrCreateUser(data: Prisma.UserCreateInput): Promise<User> {
    const { intraId, name } = data;
    console.log('PrismaUserService.findOrCreateUser');
    console.log('intraId: ', typeof intraId);
    console.log('name: ', name);

    return this.prisma.user.upsert({
      create: { intraId: intraId, name: name },
      update: {},
      where: { intraId: intraId || undefined },
    });
    // .catch(() => {
    //   return undefined;
    // });
  }
}
