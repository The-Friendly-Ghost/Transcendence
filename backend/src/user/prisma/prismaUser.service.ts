import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { User, Prisma } from '@prisma/client';
import { addFriendDto, findUserDto, setUsernameDto } from '../dto';

@Injectable()
export class PrismaUserService {
  constructor(private prisma: PrismaService) {}

  /**
   * Inserts or updates a user's username in the database.
   * @param setUsernameDto - The DTO containing the user's intraId and new username.
   * @returns The updated user object as a Promis.
   * @throws InternalServerErrorException if there was an error inserting/updating the user.
   */
  async insertOrUpdateUsername(dto: setUsernameDto): Promise<User> {
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
        throw new InternalServerErrorException();
      });
    return user;
  }

  /**
   * Finds a user in the database based on their intraId.
   * @param findUserDto - The DTO containing the intraId of the user to find.
   * @returns User Promise - The user object that matches the given intraId.
   * @throws InternalServerErrorException - If there was an error while querying the database.
   */
  async findUser(dto: findUserDto): Promise<User> {
    const user: User = await this.prisma.user
      .findUnique({
        where: { intraId: dto.intraId },
      })
      .catch((e: Error) => {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          console.error(
            'PrismaUserService.findUser error reason: ' + e.message + ' code: ' + e.code,
          );
        }
        throw new InternalServerErrorException();
      });
    return user;
  }

  /**
   * Adds a friend to a user's friend list.
   * @param addFriendDto - The DTO containing the user's intraId and the friend's intraId.
   * @returns User Promise - The updated user object.
   * @throws InternalServerErrorException - If there is an error updating the user's friend list.
   */
  async addFriend(dto: addFriendDto): Promise<User> {
    const f = await this.prisma.user.findUnique({
      where: { intraId: dto.intraId || undefined },
      select: { friends: true },
    });
    const user: User = await this.prisma.user
      .update({
        data: {
          friends: [...f.friends, dto.intraIdFriend], // TODO: how to append number to array of numbers?
        },
        where: { intraId: dto.intraId || undefined },
      })
      .catch((e: Error) => {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          console.error(
            'PrismaUserService.addFriend error reason: ' + e.message + ' code: ' + e.code,
          );
        }
        throw new InternalServerErrorException();
      });
    return user;
  }
}
