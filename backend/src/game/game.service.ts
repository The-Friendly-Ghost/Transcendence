import { Injectable } from '@nestjs/common';
import { PrismaGameService } from './prisma';

@Injectable()
export class GameService {
  constructor(private readonly prismaGameService: PrismaGameService) {}

  async getGame(gameId: number) {
    console.log('GameService.getGame');
    console.log('GameService.getGame gameId', gameId);

    const game = await this.prismaGameService.findGame({ gameId });
    return game;
  }
}
