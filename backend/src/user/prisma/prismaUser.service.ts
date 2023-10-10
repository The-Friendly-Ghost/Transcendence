import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User, Prisma } from '@prisma/client';
import { addFriendDto } from '../dto';

@Injectable()
export class PrismaUserService {
  constructor(private prisma: PrismaService) {}

  async findOrCreateUser(data: Prisma.UserCreateInput): Promise<User> {
    const { intraId, name } = data;
    console.log('PrismaUserService.findOrCreateUser');
    console.log('intraId: ', typeof intraId);
    console.log('name: ', name);

    return this.prisma.user
      .upsert({
        create: { intraId: intraId, name: name },
        update: {},
        where: { intraId: intraId || undefined },
      })
      .catch((e) => {
        console.log('PrismaUserService.findOrCreateUser error reason:', e.message);
        // throw the internal prisma error
        return undefined;
      });
  }

  async findUser(data: Prisma.UserWhereUniqueInput): Promise<User> {
    console.log('PrismaUserService.findUser');
    console.log('data: ', data);

    return this.prisma.user
      .findUnique({
        where: { intraId: data.intraId },
      })
      .catch((e) => {
        console.log('PrismaUserService.findUser error reason:', e.message);
        // throw the internal prisma error
        return undefined;
      });
  }

  async addFriend(dto: addFriendDto): Promise<User> {
    // create a dto for this!!!
    console.log('PrismaUserService.addFriend');
    console.log('intraId: ', typeof dto.intraId);

    const res = await this.prisma.user.findUnique({
      where: { intraId: dto.intraId || undefined },
      select: { friends: true },
    });
    return this.prisma.user
      .update({
        data: {
          friends: [...res.friends, dto.intraIdFriend], // TODO: how to append number to array of numbers?
        },
        where: { intraId: dto.intraId || undefined },
      })
      .catch((e) => {
        console.log('PrismaUserService.addFriend error reason:', e.message);
        // throw the internal prisma error
        return undefined;
      });
  }
}
