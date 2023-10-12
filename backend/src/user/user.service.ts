import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaUserService } from 'src/user/prisma/prismaUser.service';

@Injectable()
export class UserService {
  constructor(private readonly prismaUserService: PrismaUserService) {}

  /**
   *
   * @param intraId
   * @param username
   * @returns
   * The name of the user
   */
  async setUserName(intraId: number, username: string): Promise<string> {
    console.log('UserService.setUsername');
    console.log('intraId: ', intraId);
    console.log('username: ', username);

    // Do some stuff to add the user to the database if needed
    const user: User = await this.prismaUserService.insertOrUpdateUsername({
      intraId,
      name: username,
    });

    return user.name;
  }

  async addFriend(intraId: number, intraIdFriend: number): Promise<User> {
    console.log('UserService.validateUser');
    console.log('intraId: ', intraId);
    console.log('intraIdFriend: ', intraIdFriend);

    // Do some stuff to add the user to the database if needed
    const user: User = await this.prismaUserService.addFriend({ intraId, intraIdFriend });

    console.log('UserService.addFriend returning user:', user);
    return user;
  }
}
