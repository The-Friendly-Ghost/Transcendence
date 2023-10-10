import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  UseGuards,
} from '@nestjs/common';
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
    console.info('UserController.getMe intraId', user);
    return user;
  }

  @Post('setUserName')
  @ApiOperation({ summary: 'Set the name of the user' })
  @ApiBody({ type: String, description: 'Name to set' })
  async setUserName(@Body() body: any, @GetUser('intraId') intraId: number) {
    console.log('UserController.setUserName intraId', intraId);
    console.log('UserController.setUserName name', body.name);

    // Do something with the database
    const name: string = await this.userService
      .setUserName(intraId, body.name)
      .catch((e: Error) => {
        console.error('UserController.setUserName error: ' + e.message);
        throw new InternalServerErrorException();
      });

    return name;
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
