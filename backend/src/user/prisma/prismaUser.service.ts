import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { User, Prisma } from '@prisma/client';
import { addFriendDto, setUsernameDto } from '../dto';

@Injectable()
export class PrismaUserService {
  constructor(private prisma: PrismaService) {}

  /**
   *
   *
   * Insert or update the name of the user.
   *
   * @param dto setUsernameDto { intraId: number, name: string}
   * @returns
   * User model
   */
  async insertOrUpdateUsername(dto: setUsernameDto): Promise<User> {
    console.info('PrismaUserService.insertOrUpdateUsername');
    const user: User = await this.prisma.user
      .upsert({
        create: { intraId: dto.intraId, name: dto.name },
        update: { name: dto.name },
        where: { intraId: dto.intraId || undefined },
      })
      .catch((e: Error) => {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          console.error(
            'PrismaUserService.insertOrUpdateUsername error reason: ' +
              e.message +
              ' code: ' +
              e.code,
          );
        }
        throw new Error('Error in PrismaUserService.insertOrUpdateUsername');
      });

    return user;
  }

  async findUser(data: Prisma.UserWhereUniqueInput): Promise<User> {
    console.info('PrismaUserService.findUser');

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
