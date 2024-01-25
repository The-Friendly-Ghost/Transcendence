import { Injectable } from '@nestjs/common';
import { PrismaGameService } from './prisma';
import { GameGateway } from './game.gateway';
import { GameInfo, User } from '@prisma/client';
import { GameManager } from './gamemanager';
import { create } from 'domain';
import { clear } from 'console';
import { Invite } from './invite';

@Injectable()
export class GameService {
  constructor(private readonly prismaGameService: PrismaGameService) { }
  private pendingIntraId: number;
  private gamesInfo: GameInfo[];
  private gameManagers: Map<string, GameManager> = new Map();
  private invites: Map<number, Invite> = new Map();

  async resetGames(userId: number) {
    console.log('GameService.resetGames');
    console.log('GameService.resetGames userId', userId);

    const succes = await this.prismaGameService.resetGames();
    const response = {
      success: succes,
    };
    return response;
  }


  async create_game(p1: number, p2: number): Promise<GameInfo> {
    const game = await this.prismaGameService.createGame({
      p1: p1,
      p2: p2,
      state: "PENDING",
      roomName: Math.floor(Math.random() * 1000000000).toString(),
    });
    return game;
  }

  async testGame(p1: number, gateway: GameGateway) {
    let gameInfo: GameInfo;
    let gameManager: GameManager;

    console.log("Test Game:")
    gameInfo = await this.create_game(p1, p1);
    gateway.sendToUser(p1, "gameroom", gameInfo.roomName);
    gameManager = new GameManager(gameInfo, gateway, this.cleanupGame.bind(this));
    this.gameManagers.set(gameInfo.roomName, gameManager);
    console.log(gameInfo);
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

    gameInfo = await this.create_game(p1, p2);
    gateway.sendToUser(p1, "gameroom", gameInfo.roomName);
    gateway.sendToUser(p2, "gameroom", gameInfo.roomName);
    console.log("gameroom created:");
    gameManager = new GameManager(gameInfo, gateway, this.cleanupGame.bind(this));
    console.log("game initialized.");
    this.gameManagers.set(gameInfo.roomName, gameManager);
    console.log(gameInfo);
  }

  cleanupGame(gameInfo: GameInfo) {
    this.gameManagers.delete(gameInfo.roomName);
    this.prismaGameService.updateGame(gameInfo);
  }

  async invitePlayer(intraId: number, playerId: number) {
    let invite: Invite = new Invite(intraId);
    this.invites.set(invite.getId(), invite);
    return invite.getId();
  };

  async acceptInvite(inviteId: number, intraId: number) {
    this.invites.get(inviteId).acceptInvite(intraId);
    return true;
  };

  async disconnect_from_game(intraId: number) {
    if (this.pendingIntraId == intraId) {
      this.pendingIntraId = null;
    }
  }

  async getMatchHistory(intraId: number): Promise<any> {
    console.log('GameService.getMatchHistory userId', intraId);

    const matches = await this.prismaGameService.getMatchHistory(intraId);
    return matches;
  }
}
