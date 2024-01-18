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

  async updateAvatar(intraId: number, avatar: any) {
    await this.prisma.user.update({
      where: { intraId: intraId },
      data: { avatar: avatar },
    }).catch((e: Prisma.PrismaClientKnownRequestError) => {
      console.error('PrismaUserService.updateAvatar error reason: ' + e.message + ' code: ' + e.code);
      throw new Error('failed to update avatar in database');
    });
    return {message: 'avatar updated'};
  }

  /**
   * Adds a friend with the specified intra ID to the user with the authenticated intra ID.
   * If the user already has the friend as a friend, returns the friend.
   * @param addFriendDto - The DTO containing the intra ID of the friend to add.
   * @returns The updated user object.
   * @throws InternalServerErrorException if there is an error updating the user in the database.
   */
  async addFriend(dto: addFriendDto): Promise<User> {
    const f = await this.prisma.user
      .findUnique({
        where: { intraId: dto.intraId || undefined },
        select: { friends: true },
      })
      .catch((e: Prisma.PrismaClientKnownRequestError) => {
        console.error(
          'PrismaUserService.addFriend error reason: ' + e.message + ' code: ' + e.code,
        );
        throw new InternalServerErrorException();
      });

    const user: User = await this.prisma.user
      .update({
        data: {
          friends: [...new Set([...f.friends, dto.intraIdFriend])], // Set removes duplicates
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

  async removeFriend(intraId: number, intraIdFriend: number) {
    const {friends} = await this.prisma.user.findUnique({
      where: {intraId: intraId},
      select: {friends: true},
    })
    const user = await this.prisma.user.update({
      where: { intraId: intraId },
      data: { friends: { set: friends.filter((intraId) => intraId !== intraIdFriend) } },
    });

    if (!user) throw new NotFoundException('user not found');
    return { message: 'friend removed' };
  }
}
