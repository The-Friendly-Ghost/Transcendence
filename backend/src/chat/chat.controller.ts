import {
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PrismaChatService } from './prisma';
import { ChatService } from './chat.service';
import { Jwt2faAuthGuard } from 'src/2fa/guard';
import { GetUser } from 'src/auth/decorator';
import { User } from '@prisma/client';

@UseGuards(Jwt2faAuthGuard)
@Controller('chat')
@ApiTags('chat')
export class ChatController {
  constructor(
    private prisma_chat: PrismaChatService,
    private chat: ChatService,
  ) {}

  @ApiOperation({ summary: 'create chatroom.' })
  @Put('create_chatroom/:chatroom_name')
  async create_chatroom(@GetUser() user: User, @Param('chatroom_name') chatroom_name: string): Promise<any> {
    console.log("create_chatroom ACTIVATED -----------------------");
    return await this.chat.create_chatroom(user.intraId, chatroom_name).catch((e: Error) => {
      return e.message;
    });
  }

  @ApiOperation({ summary: 'delete chatroom.' })
  @Delete('delete_chatroom/:chatroom_name')
  async delete_chatroom(@GetUser() user: User, @Param('chatroom_name') chatroom_name: string): Promise<any> {
    return await this.chat.delete_chatroom(user.intraId, chatroom_name).catch((e: Error) => {
      return e.message;
    });
  }

  @ApiOperation({ summary: 'add user to chatroom.' })
  @Put('add_user_to_chatroom/:chatroom_name/:intraId')
  async add_user_to_chatroom(
    @GetUser() user: User,
    @Param('chatroom_name') chatroom_name: string,
    @Param('intraId', ParseIntPipe) intraId: number,
  ): Promise<any> {
    return await this.chat.add_user_to_chatroom(user.intraId, chatroom_name, intraId).catch((e: Error) => {
      return e.message;
    });
  }

  @ApiOperation({ summary: 'remove a user form a chatroom.' })
  @Put('remove_user_from_chatroom/:chatroom_name/:intraId')
  async remove_user_from_chatroom(@GetUser() deleter: User, @Param('chatroom_name') chatroom_name: string, @Param('intraId', ParseIntPipe) intraId: number): Promise<any> {
    return await this.chat.remove_user_from_chatroom(deleter.intraId, chatroom_name, intraId).catch((e: Error) => {
      return e.message;
    });
  }

  @ApiOperation({ summary: 'toggle private/public.' })
  @Put('toggle_access/:chatroom_name')
  async toggle_access(@GetUser() user: User, @Param('chatroom_name') chatroom_name: string): Promise<any> {
    return await this.chat.toggle_access(user.intraId, chatroom_name).catch((e: Error) => {
      return e.message;
    });
  }

  @ApiOperation({ summary: 'leave a chatroom.' })
  @Put('leave_chatroom/:chatroom_name')
  async leave_chatroom(@GetUser() user: User, @Param('chatroom_name') chatroom_name: string): Promise<any> {
    return await this.chat.leave_chatroom(user.intraId, chatroom_name).catch((e: Error) => {
      return e.message;
    });
  }

  @ApiOperation({ summary: 'Make a user admin.' })
  @Put('make_admin/:chatroom_name/:intraId')
  async make_admin(@GetUser() user: User, @Param('chatroom_name') chatroom_name: string, @Param('intraId', ParseIntPipe) intraId: number): Promise<any> {
    return await this.chat.make_admin(user.intraId, chatroom_name, intraId).catch((e: Error) => {
      return e.message;
    });
  }

  @ApiOperation({ summary: 'Joing chatroom.'})
  @Put('join_chatroom/:chatroom_name')
  async join_chatroom(@GetUser() user: User, @Param('chatroom_name') chatroom_name: string): Promise<any> {
    return await this.chat.join_chatroom(user.intraId, chatroom_name).catch((e: Error) => {
      return e.message;
    });
  }

  @ApiOperation({ summary: 'Change owner.'})
  @Put('change_owner/:chatroom_name/:intraId')
  async change_owner(@GetUser() user: User, @Param('chatroom_name') chatroom_name: string, @Param('intraId', ParseIntPipe) intraId: number): Promise<any> {
    return await this.chat.change_owner(user.intraId, chatroom_name, intraId).catch((e: Error) => {
      return e.message;
    });
  }

  @ApiOperation({ summary: 'Get chatroom.'})
  @Get('get_chatroom/:chatroom_name')
  async get_chatroom(@GetUser() user: User, @Param('chatroom_name') chatroom_name: string): Promise<any> {
    return await this.chat.get_chatroom(user.intraId, chatroom_name).catch((e: Error) => {
      return e.message;
    });
  }

  @ApiOperation({ summary: 'Get protected chatroom.'})
  @Get('get_protected_chatroom/:chatroom_name/:password')
  async get_protected_chatroom(@GetUser() user: User, @Param('chatroom_name') chatroom_name: string, @Param('password') password: string): Promise<any> {
    return await this.chat.get_protected_chatroom(user.intraId, chatroom_name, password).catch((e: Error) => {
      return e.message;
    });
  }

  @ApiOperation({ summary: 'Set password.'})
  @Put('set_password/:chatroom_name/:password')
  async set_password(@GetUser() user: User, @Param('chatroom_name') chatroom_name: string, @Param('password') password: string): Promise<any> {
    return await this.chat.set_password(user.intraId, chatroom_name, password).catch((e: Error) => {
      return e.message;
    });
  }

  @ApiOperation({ summary: 'Reset password.'})
  @Put('reset_password/:chatroom_name')
  async reset_password(@GetUser() user: User, @Param('chatroom_name') chatroom_name: string): Promise<any> {
    return await this.chat.set_password(user.intraId, chatroom_name, null).catch((e: Error) => {
      return e.message;
    });
  }

  @ApiOperation({ summary: 'Ban user.'})
  @Put('ban_user/:chatroom_name/:intraId')
  async ban_user(@GetUser() user: User, @Param('chatroom_name') chatroom_name: string, @Param('intraId', ParseIntPipe) bannedUserId: number): Promise<any> {
    return await this.chat.ban_user(user.intraId, chatroom_name, bannedUserId).catch((e: Error) => {
      return e.message;
    });
  }

  @ApiOperation({ summary: 'Connect to chatroom.'})
  @Put('connect_to_chatroom/:chatroom_name')
  async connect_to_chatroom(@GetUser() user: User, @Param('chatroom_name') chatroom_name: string): Promise<any> {
    return await this.chat.connect_to_chatroom(user.intraId, chatroom_name).catch((e: Error) => {
      return e.message;
    });
  }

  @ApiOperation({ summary: 'Get all chatrooms.'})
  @Get('get_all_chatrooms')
  async get_all_chatrooms(): Promise<any> {
    return await this.chat.get_all_chatrooms().catch((e: Error) => {
      return e.message;
    });
  }

}
