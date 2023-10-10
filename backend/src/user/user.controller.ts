import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
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
    console.log('UserController.getMe intraId', user);
    return user;
  }

  @Post('addFriend')
  @ApiOperation({ summary: 'Add a friend to the friendlist' })
  @ApiBody({ type: Object, description: 'Friend to add' })
  async addUser(@Body() body: any, @GetUser('intraId') intraId: number) {
    console.log('UserController.addFriend intraId', body.intraIdFriend);

    // Do something with the database
    const result = await this.userService.addFriend(intraId, body.intraIdFriend);
    return result;
  }
}
