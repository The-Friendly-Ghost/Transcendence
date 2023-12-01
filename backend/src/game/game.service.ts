import { Injectable } from '@nestjs/common';
import { PrismaGameService } from './prisma';
import { Game, User } from '@prisma/client';
import { create } from 'domain';
import { clear } from 'console';

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
    else if (game.p1 != userId) {
      console.log("game found")
      game.p2 = userId;
      game.state = "IN_PROGRESS";
      await this.prismaGameService.updateGame(game);
    }
    return game;
  }

  async resetGames(userId: number) {
    console.log('GameService.resetGames');
    console.log('GameService.resetGames userId', userId);

    const succes = await this.prismaGameService.resetGames();
    const response = {
      success: succes,
    };
    return response;
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

  async create_gameroom(): Promise<string> {
    const roomName = Math.random().toString().substring(2, 15)
    return roomName;
  }

  async gameWait(gameInfo: any): Promise<void> {
    let game: Game = await this.prismaGameService.findGame({ gameId: gameInfo.id });
    console.log(game);
    if (game == null) {
      console.log("Something went wrong");
      clearInterval(gameInfo.intervalID);
    }
    else if (game && game.state == "PENDING") {
      // wait for players to join
      // send game state to players
      // wait for players to send action
      // send action to game
      // update game state
      console.log(game);
      console.log("waiting for players to join");
    }
    else if (game.state == "IN_PROGRESS") {
      console.log("game ready to start");
      clearInterval(gameInfo.intervalID);
    }
  }

  async create_game(userId: number): Promise<Game> {
    const game = await this.prismaGameService.createGame({
      p1: userId,
      p2: -1,
      state: "PENDING",
      roomName: Math.random().toString().substring(2, 15) // Turn this into a game room
    });
    // this.prismaGameService.findGame({ gameId: game.id });
    let gameInfo = { id: game.id, intervalID: null };
    gameInfo.intervalID = setInterval(() => this.gameWait(gameInfo), 1000);
    return game;
  }

  async gameLoop() {
    // while (game.state == "IN_PROGRESS") {
    //   // get game state
    //   // send game state to players
    //   // wait for players to send action
    //   // send action to game
    //   // update game state
    // }
  }
}
