import { Injectable } from '@nestjs/common';
// import { PrismaService } from 'src/prisma/prisma.service';
// import { User, Prisma, Access } from '@prisma/client';

@Injectable()
export class PrismaUserService {
  // constructor(private prisma: PrismaService) {}
  // async findOrCreateUser(data: Prisma.UserCreateInput): Promise<User> {
  //   const { intraId, name } = data;
  //   return this.prisma.user
  //     .upsert({
  //       where: { intraId },
  //       update: {},
  //       create: { intraId, name },
  //     })
  //     .catch(() => {
  //       return undefined;
  //     });
  // }
}
