import { Injectable } from '@nestjs/common';
import { PrismaChatService } from './prisma/prisma_chat.service';
import { ChatRoom } from '@prisma/client';
import { isInstance } from 'class-validator';
import { NotFoundError } from 'rxjs';

@Injectable()
export class ChatService {
  constructor(private prisma_chat: PrismaChatService) {}

  async createChatRoom(intraId: number, name: string) {
    const chatroom: ChatRoom = await this.prisma_chat.addChatRoom(intraId, name);
    if (!chatroom) {
      return 'Chatroom already exist';
    }
    console.log('chatroom name:', chatroom);

    return 'wololoooo';
  }
}
