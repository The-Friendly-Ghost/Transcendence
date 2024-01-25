import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaUserService } from 'src/user/prisma/prismaUser.service';
import { FileTypeValidationPipe } from './decorator';

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
    const user: User = await this.prismaUserService.updateUsername({
      intraId,
      name: username,
    });

    return user.name;
  }

  async getUser(intraId: number): Promise<User> {
    console.log('UserService.getUser');
    // console.log('intraId: ', intraId);

    // Do some stuff to add the user to the database if needed
    const user: User = await this.prismaUserService.findUser({ intraId });

    return user;
  }

  async setAvatar(intraId: number, avatar: any): Promise<any> {
    if (avatar.mimetype === 'image/jpeg' || avatar.mimetype === 'image/png')
      return this.prismaUserService.updateAvatar(intraId, avatar).catch((e) => {throw new Error(e.message)});

    throw new Error('only jpeg and png file are accepted');
  }

  async addFriend(intraId: number, intraIdFriend: number): Promise<User> {
    console.log('UserService.validateUser');
    console.log('intraId: ', intraId);
    console.log('intraIdFriend: ', intraIdFriend);

    // Check if the user is in the database. Throws NotFoundException if not found
    await this.prismaUserService.findUser({ intraId: intraIdFriend });

    // Add the friend to the user
    const user: User = await this.prismaUserService.addFriend({ intraId, intraIdFriend });

    console.log('UserService.addFriend returning user');
    return user;
  }

  async removeFriend(intraId: number, intraIdFriend: number){
    console.log('UserService.removeFriend');
    console.log('intraId: ', intraId);
    console.log('intraIdFriend: ', intraIdFriend);

    // Check if the user is in the database. Throws NotFoundException if not found
    // const user: User = await this.prismaUserService.findUser({ intraId: intraIdFriend });
    // if (!user)
    //   throw new Error('User not found');

    await this.prismaUserService.removeFriend(intraId, intraIdFriend).catch((e) => {throw new Error(e.message)});

    console.log('UserService.removeFriend returning user');
    return "User removed from friend list";
  }

  async get_all_users(): Promise<User[]> {
    return this.prismaUserService.get_all_users();
  }

  async addWin(intraId: number): Promise<User> {  
    return this.prismaUserService.addWin(intraId);
  }

  async addLoss(intraId: number): Promise<User> {  
    return this.prismaUserService.addLoss(intraId);
  }
}
