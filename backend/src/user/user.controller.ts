import {
  BadRequestException,
  Controller,
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
  @ApiOperation({
    summary: 'Upload avatar',
    description: 'Upload avatar',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  // @UsePipes(new FileTypeValidationPipe())
  uploadFile(@UploadedFile() file: Express.Multer.File, @GetUser() user: User) {
    // console.log("avatar:\n", file);
    // console.log("user:\n", user);
    // console.log("intraId:\n", user.intraId);
    return (this.userService.setAvatar(user.intraId, file).catch((e) => {return {message: e.message}}));
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

  @Put('setUserName/:userName')
  @ApiOperation({
    summary: 'Set the name of the user',
    description:
      'Updates the name of the user with the authenticated intra ID to the specified name.',
  })
  async setUserName(@Param('username') userName: string, @GetUser('intraId') intraId: number) {
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
}
