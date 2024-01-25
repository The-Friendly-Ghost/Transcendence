import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { ApiOperation, ApiTags, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { UserService } from './user.service';
import { Jwt2faAuthGuard } from 'src/2fa/guard';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileTypeValidationPipe } from './decorator';
import { PrismaUserService } from 'src/user/prisma/prismaUser.service';

@UseGuards(Jwt2faAuthGuard)
@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(
    private readonly userService: UserService) {}
  @Get('getMe')
  @ApiOperation({
    summary: 'Get the authenticated user',
    description: 'Retrieves the user with the authenticated intra ID.',
  })
  async getMe(@GetUser() user: User) {
    console.info('UserController.getMe intraId');
    return user;
  }

  @Post('upload_avatar/:img')
  @UseInterceptors(FileInterceptor('newAvatar'))
  @ApiOperation({
    summary: 'Upload avatar',
    description: 'Upload avatar',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        newAvatar: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  // @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() newAvatar: Express.Multer.File, @GetUser() user: User) {
    return (this.userService.setAvatar(user.intraId, newAvatar).catch((e) => {return {message: e.message}}));
  }

  @Get('getUser/:intraId')
  @ApiOperation({
    summary: 'Get user by intra ID',
    description: 'Retrieves the user with the specified intra ID.',
  })
  async getUser(@Param('intraId', ParseIntPipe) intraId: number) {
    console.log('UserController.getUser intraId', intraId);

    const user: User = await this.userService.getUser(intraId);
    return user;
  }

  @Post('setUserName/:userName')
  @ApiOperation({
    summary: 'Set the name of the user',
    description:
      'Updates the name of the user with the authenticated intra ID to the specified name.',
  })
  async setUserName(@GetUser('intraId') intraId: number, @Param('userName') userName: string) {
    console.log('UserController.setUserName intraId', intraId);
    console.log('UserController.setUserName userName', userName);

    const name: string = await this.userService.setUserName(intraId, userName);
    return name;
  }

  @Post('addFriend/:friendId')
  @ApiOperation({
    summary: 'Add a friend to the user',
    description:
      'Adds a friend with the specified ID to the user with the authenticated intra ID. Throws a BadRequestException if the friend ID is the same as the authenticated intra ID.',
  })
  async postFriend(
    @Param('friendId', ParseIntPipe) friendId: number,
    @GetUser('intraId') intraId: number,
  ) {
    console.log('UserController.postFriend intraId', friendId);

    if (intraId === friendId) throw new BadRequestException("You can't add yourself as a friend.");

    const user: User = await this.userService.addFriend(intraId, Number(friendId));
    return user;
  }

  @Delete('removeFriend/:friendId')
  @ApiOperation({
    summary: 'Remove a friend from the user',
    description:
      'Removes a friend with the specified ID from the user with the authenticated intra ID.',
  })
  async deleteFriend(
    @Param('friendId', ParseIntPipe) friendId: number,
    @GetUser('intraId') intraId: number,
  ) {
    console.log('UserController.deleteFriend intraId', friendId);

    return await this.userService.removeFriend(intraId, Number(friendId)).catch((e) => {return {message: e.message}});
  }

  @Get('get_all_users')
  @ApiOperation({
    summary: 'Get all users',
    description: 'Retrieves all users.',
  })
  async getAllUsers() {
    console.log('UserController.getAllUsers');

    const users: User[] = await this.userService.get_all_users();
    return users;
  }

  @Post('add_win')
  @ApiOperation({
    summary: 'Add a win to the user',
    description: 'Add a win to the user.',
  })
  async addWin(@GetUser('intraId') intraId: number) {
    console.log('UserController.addWin intraId', intraId);

    const user: User = await this.userService.addWin(intraId);
    return user;
  }

  @Post('add_loss')
  @ApiOperation({
    summary: 'Add a win to the user',
    description: 'Add a win to the user.',
  })
  async addLoss(@GetUser('intraId') intraId: number) {
    console.log('UserController.addWin intraId', intraId);

    const user: User = await this.userService.addLoss(intraId);
    return user;
  }
}
