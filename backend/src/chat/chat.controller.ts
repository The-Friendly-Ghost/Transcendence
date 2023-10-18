import { Controller, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PrismaChatService } from './prisma';
import { ChatService } from './chat.service';

@Controller('chat')
@ApiTags('chat')
export class ChatController {
  constructor(
    private prisma_chat: PrismaChatService,
    private chat: ChatService,
  ) {}

  @ApiOperation({ summary: 'create chatroom.' })
  @Post('create_chat_room/:intraId/:name')
  async create_chat_room(
    @Param('intraId', ParseIntPipe) intraId: number,
    @Param('name') name: string,
  ): Promise<any> {
    return await this.chat.createChatRoom(intraId, name);
  }
}
