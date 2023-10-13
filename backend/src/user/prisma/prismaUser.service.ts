import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { User, Prisma } from '@prisma/client';
import { addFriendDto, findUserDto, insertUserDto, updateUsernameDto } from '../dto';

@Injectable()
export class PrismaUserService {
  constructor(private prisma: PrismaService) {}

  async firstInsertUsername(dto: insertUserDto): Promise<User> {
    const user: User = await this.prisma.user
      .upsert({
        create: { intraId: dto.intraId, name: dto.name, image_url: dto.image_url },
        update: {},
        where: { intraId: dto.intraId || undefined },
      })
      .catch((e: Prisma.PrismaClientKnownRequestError) => {
        console.error(
          'PrismaUserService.firstInsertUsername error reason: ' + e.message + ' code: ' + e.code,
        );
        throw new InternalServerErrorException();
      });
    return user;
  }

  /**
   * Inserts or updates a user's username in the database.
   * @param updateUsernameDto - The DTO containing the user's intraId and new username.
   * @returns The updated user object as a Promis.
   * @throws InternalServerErrorException if there was an error inserting/updating the user.
   */
  async updateUsername(dto: updateUsernameDto): Promise<User> {
    const user: User = await this.prisma.user
      .update({
        data: { intraId: dto.intraId, name: dto.name },
        where: { intraId: dto.intraId || undefined },
      })
      .catch((e: Prisma.PrismaClientKnownRequestError) => {
        console.error(
          'PrismaUserService.insertOrUpdateUsername error reason: ' +
            e.message +
            ' code: ' +
            e.code,
        );
        throw new InternalServerErrorException();
      });
    return user;
  }

  /**
   * Finds a user in the database by their intraId.
   * @param findUserDto - The DTO containing the intraId of the user to find.
   * @returns The user object if found.
   * @throws NotFoundException if the user is not found.
   */
  async findUser(dto: findUserDto): Promise<User> {
    const user: User = await this.prisma.user
      .findUniqueOrThrow({
        where: { intraId: dto.intraId },
      })
      .catch((e: Prisma.PrismaClientKnownRequestError) => {
        console.error('PrismaUserService.findUser error reason: ' + e.message + ' code: ' + e.code);
        throw new NotFoundException();
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
      .catch((e: Prisma.PrismaClientKnownRequestError) => {
        console.error(
          'PrismaUserService.addFriend error reason: ' + e.message + ' code: ' + e.code,
        );
        throw new InternalServerErrorException();
      });
    return user;
  }
}
