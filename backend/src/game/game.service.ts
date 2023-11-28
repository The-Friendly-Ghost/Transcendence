import { Injectable } from '@nestjs/common';
import { PrismaGameService } from './prisma';
import { Game, User } from '@prisma/client';
import { create } from 'domain';

@Injectable()
export class GameService {
  constructor(private readonly prismaGameService: PrismaGameService) { }

  async searchGame(userId: number) {
    console.log('GameService.searchGame');
    console.log('GameService.searchGame userId', userId);

    let game = await this.prismaGameService.searchGame();
    // game returns null if no game is found
    // then create a new one
    // return that
    if (game == null) {
      // let gameroom = await this.create_gameroom();
      game = await this.create_game(userId);
    }
    return game;
  }

  async getGame(gameId: number) {
    console.log('GameService.getGame');
    console.log('GameService.getGame gameId', gameId);

    const game = await this.prismaGameService.findGame({ gameId });
    return game;
  }

  async startGame(p1: string) {
    // connect to socket


  }

  // async create_gameroom(): Promise<GameRoom> {
  //   const gameroom = await this.prismaGameService.createGameroom({
  //     p1: -1,
  //     p2: -1,
  //     state: "PENDING",
  //   });
  //   return gameroom;
  // }

  async create_game(userId: number): Promise<Game> {
    const game = await this.prismaGameService.createGame({
      p1: userId,
      p2: -1,
      state: "PENDING",
    });
    return game;
  }
}
