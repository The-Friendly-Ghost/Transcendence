import { Controller, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { JwtAuthGuard } from 'src/auth/guard';
import { UserService } from './user.service';

@UseGuards(JwtAuthGuard)
@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('me')
  @ApiOperation({ summary: 'Get json of me' })
  async getMe(@GetUser() user: User) {
    console.info('UserController.getMe intraId', user);
    return user;
  }

  @Put('setUserName/:userName')
  @ApiOperation({ summary: 'Set the name of the user' })
  async setUserName(@Param('username') userName: string, @GetUser('intraId') intraId: number) {
    console.log('UserController.setUserName intraId', intraId);
    console.log('UserController.setUserName userName', userName);

    const name: string = await this.userService.setUserName(intraId, userName);
    return name;
  }

  @Post('addFriend/:friendId')
  @ApiOperation({ summary: 'Add a friend to the friendlist' })
  async postFriend(
    @Param('friendId', ParseIntPipe) friendId: number,
    @GetUser('intraId') intraId: number,
  ) {
    console.log('UserController.addFriend intraId', friendId);

    const user: User = await this.userService.addFriend(intraId, Number(friendId));
    return user;
  }
}
