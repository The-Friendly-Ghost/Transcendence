import { Injectable, NotFoundException } from '@nestjs/common';
import { ChatRoom, Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class PrismaChatService {
  constructor(private prisma: PrismaService) {}

  async addChatRoom(intraId: number, name: string) {
    const chatroom: ChatRoom = await this.prisma.chatRoom
      .findUniqueOrThrow({
        where: {
          name: name,
        },
      })
      .catch((e: Prisma.PrismaClientKnownRequestError) => {
        if (e instanceof NotFoundException) {
          return null;
        }
      });
    if (!chatroom) {
      return await this.prisma.chatRoom.create({
        data: {
          name: name,
          users: {
            connect: {
              intraId: intraId,
            },
          },
        },
      });
    }
    return null;
  }

  async getChatRoom(name: string): Promise<ChatRoom> {
    return await this.prisma.chatRoom
      .findUniqueOrThrow({
        where: {
          name: name,
        },
      })
      .catch((e: Prisma.PrismaClientKnownRequestError) => {
        console.error('PrismaUserService.findUser error reason: ' + e.message + ' code: ' + e.code);
        throw new NotFoundException();
      });
  }
}
