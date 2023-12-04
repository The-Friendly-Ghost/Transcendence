import { Injectable } from '@nestjs/common';
import { PrismaGameService } from './prisma';
import { GameInfo, User } from '@prisma/client';
import { Game, GameManager } from './game';
import { create } from 'domain';
import { clear } from 'console';

@Injectable()
export class GameService {
  constructor(private readonly prismaGameService: PrismaGameService) { }
  private pendingIntraId: number;
  private gamesInfo: GameInfo[];
  private gameInterval: NodeJS.Timeout;
  private gameCount: number = 0;

  async resetGames(userId: number) {
    console.log('GameService.resetGames');
    console.log('GameService.resetGames userId', userId);

    const succes = await this.prismaGameService.resetGames();
    const response = {
      success: succes,
    };
    return response;
  }

  async listGames(): Promise<void> {
    console.log(this.gamesInfo);
  }

  async create_game(p1: number, p2: number): Promise<GameInfo> {
    const game = await this.prismaGameService.createGame({
      p1: p1,
      p2: p2,
      state: "PENDING",
      roomName: Math.random().toString().substring(2, 15) // Turn this into a game room
    });
    this.gameInterval = setInterval(() => { this.gameLoop(game) }, 1000);
    this.listGames();
    this.gamesInfo.push(game);
    this.gameCount++;
    return game;
  }

  async gameLoop(gameInfo: GameInfo) {
  }

  async joinQueue(intraId: number) {
    console.log('GameService.joinQueue userId', intraId);
    // Check if player is already in game
    const game = await this.prismaGameService.findGame({ userId: intraId });
    if (game != null) {
      console.log(intraId, "is already in a game");
      return;
    }
    // Check if a player is in queue already, if not add player to queue
    if (this.pendingIntraId == null && !Number.isNaN(intraId)) {
      this.pendingIntraId = intraId;
    }
    else if (this.pendingIntraId != intraId && !Number.isNaN(intraId)) {
      console.log("Found 2 users starting a game");
      await this.start_game(intraId, this.pendingIntraId);
      this.pendingIntraId = null;
    }

  }

  async start_game(p1: number, p2: number) {
    let gameInfo: GameInfo;

    console.log("Lets get ready to rumble!!");
    gameInfo = await this.create_game(p1, p2);
    console.log("game created:");
    console.log(gameInfo);
  }

  async disconnect_from_game(intraId: number) {
    if (this.pendingIntraId == intraId) {
      this.pendingIntraId = null;
    }
  }
}
