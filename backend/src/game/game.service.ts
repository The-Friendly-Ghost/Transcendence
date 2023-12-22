import { Injectable } from '@nestjs/common';
import { PrismaGameService } from './prisma';
import { GameGateway } from './game.gateway';
import { GameInfo, User } from '@prisma/client';
import { GameManager } from './gamemanager';
import { create } from 'domain';
import { clear } from 'console';

@Injectable()
export class GameService {
  constructor(private readonly prismaGameService: PrismaGameService) { }
  private pendingIntraId: number;
  private gamesInfo: GameInfo[];
  private gameInterval: NodeJS.Timeout;

  private gameManagers: Map<string, GameManager> = new Map();
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
    this.listGames();
    // this.gamesInfo.push(game);
    this.gameCount++;
    return game;
  }


  async gameLoop(gameInfo: GameInfo, gateway: GameGateway, gameManager: GameManager) {
    gameManager.update();
    // gateway.sendToUser(Number(gameInfo.roomName), "gamestate", "gameloop");
    // console.log("gameLoop");
    if (gameInfo.state == "IN_PROGRESS" || gameInfo.state == "PENDING") {
      setTimeout(() => { this.gameLoop(gameInfo, gateway, gameManager) }, 10)
    }
    else {
      console.log("game finished");
      this.prismaGameService.updateGame(gameInfo);
      this.gameManagers.delete(gameInfo.roomName);
      // clearTimeout(this.gameInterval);
    }
  }

  async testGame(p1: number, gateway: GameGateway) {
    let gameInfo: GameInfo;
    let gameManager: GameManager;

    console.log("Lets get ready to rumble!!");
    gameInfo = await this.create_game(p1, p1);
    gameManager = new GameManager(gameInfo, gateway);
    console.log("game created:");
    gateway.sendToUser(p1, "gameroom", gameInfo.roomName);
    // gateway.sendToUser(p2, "gameroom", gameInfo.roomName);
    this.gameInterval = setTimeout(() => { this.gameLoop(gameInfo, gateway, gameManager) }, 100);
    this.gameManagers.set(gameInfo.roomName, gameManager);
    console.log(gameInfo);
  };

  async userInput(input: any) {
    let gameManager: GameManager;

    gameManager = this.gameManagers.get(input.gameRoom);
    // gameManager.userInput(input);
    // console.log(gameManager);
    if (gameManager)
      gameManager.userInput(input);
  };


  async joinQueue(intraId: number, gateway: GameGateway) {
    console.log('GameService.joinQueue userId', intraId);
    // Check if player is already in game
    const game = await this.prismaGameService.findGame({ userId: intraId });
    if (game != null && game.state != "FINISHED") {
      gateway.sendToUser(intraId, "info", "You are already in a game");
      gateway.sendToUser(intraId, "gameroom", game.roomName);
      console.log(intraId, "is already in a game");

      return;
    }
    // Check if a player is in queue already, if not add player to queue
    if (this.pendingIntraId == null && !Number.isNaN(intraId)) {
      this.pendingIntraId = intraId;
      gateway.sendToUser(intraId, "info", "Added to queue");
    }
    else if (this.pendingIntraId != intraId && !Number.isNaN(intraId)) {
      console.log("Found 2 users starting a game");
      gateway.sendToUser(intraId, "info", "Found a player starting game");
      await this.start_game(intraId, this.pendingIntraId, gateway);
      this.pendingIntraId = null;
    }
    else {
      console.log("User is already in queue");
      gateway.sendToUser(intraId, "info", "You are already in queue");
    }
  }

  async start_game(p1: number, p2: number, gateway: GameGateway) {
    let gameInfo: GameInfo;
    let gameManager: GameManager;

    console.log("Lets get ready to rumble!!");
    gameInfo = await this.create_game(p1, p2);
    gameManager = new GameManager(gameInfo, gateway);
    console.log("game created:");
    gateway.sendToUser(p1, "gameroom", gameInfo.roomName);
    gateway.sendToUser(p2, "gameroom", gameInfo.roomName);
    this.gameInterval = setTimeout(() => { this.gameLoop(gameInfo, gateway, gameManager) }, 100);
    this.gameManagers.set(gameInfo.roomName, gameManager);
    console.log(gameInfo);
  }

  async disconnect_from_game(intraId: number) {
    if (this.pendingIntraId == intraId) {
      this.pendingIntraId = null;
    }
  }
}
