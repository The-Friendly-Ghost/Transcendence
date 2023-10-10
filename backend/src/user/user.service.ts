import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaUserService } from 'src/user/prisma/prismaUser.service';

@Injectable()
export class UserService {
  constructor(private readonly prismaUserService: PrismaUserService) {}

  async addFriend(intraId: number, intraIdFriend: number): Promise<any> {
    console.log('UserService.validateUser');
    console.log('intraId: ', intraId);
    console.log('intraIdFriend: ', intraIdFriend);

    // Do some stuff to add the user to the database if needed
    const res = await this.prismaUserService.addFriend({ intraId, intraIdFriend });

    console.log('UserService.addFriend returning user:', res);
    return res;
  }
}
