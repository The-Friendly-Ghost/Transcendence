import { Injectable } from '@nestjs/common';
import { PrismaGameService } from './prisma';
import { GameInfo, User } from '@prisma/client';
import { GameManager } from './gamemanager';
import { Invite } from './invite';
import { GatewayService } from 'src/gateway/gateway.service';
import { GatewayGateway } from 'src/gateway/gateway.gateway';
import { Socket } from 'socket.io';
import { UserService } from 'src/user/user.service';

@Injectable()
export class GameService {
  constructor(
    private readonly prismaGameService: PrismaGameService,
    private gatewayService: GatewayService,
    private gateway: GatewayGateway,
    private userService: UserService
  ) { }
  private gameManagers: Map<string, GameManager> = new Map();

  async onModuleInit() {
    this.gateway.server.on('connection', this.setupListeners.bind(this));
    // this.gateway.server.on('disconnect', this.disconnect_from_game.bind(this));
  };

  setupListeners(client: Socket) {
    client.on('testGame', (data: any) => {
      this.testGame(client, Number(data.userId));
    });
  };

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

  async testGame(client: Socket, p1: number) {
    let gameInfo: GameInfo;
    let gameManager: GameManager;
    console.log("Test Game:")
    gameInfo = await this.create_game(p1, p1);
    client.emit('gameroom', gameInfo.roomName);
    gameManager = new GameManager(gameInfo, this.gatewayService, this.gateway, this.cleanupGame.bind(this), this.startGameCallback.bind(this));
    this.gameManagers.set(gameInfo.roomName, gameManager);
    console.log(gameInfo);
  };

  async start_game(p1: number, p2: number) {
    let gameInfo: GameInfo;
    let gameManager: GameManager;
    let client1: Socket;
    let client2: Socket;

    client1 = this.gatewayService.get_socket_from_user(p1);
    client2 = this.gatewayService.get_socket_from_user(p2);
    if (client1 == undefined || client2 == undefined) {
      console.log("One or both players are not online");
      return;
    }
    gameInfo = await this.create_game(p1, p2);
    client1.emit('gameroom', gameInfo.roomName);
    client2.emit('gameroom', gameInfo.roomName);
    console.log("gameroom created:");
    gameManager = new GameManager(gameInfo, this.gatewayService, this.gateway, this.cleanupGame.bind(this), this.startGameCallback.bind(this));
    console.log("game initialized.");
    this.gameManagers.set(gameInfo.roomName, gameManager);
    console.log(gameInfo);
  }

  startGameCallback(gameInfo: GameInfo) {
    this.prismaGameService.updateGame(gameInfo);
  }

  cleanupGame(gameInfo: GameInfo) {
    this.userService.addWin(gameInfo.winner);
    this.userService.addLoss(gameInfo.loser);
    this.gameManagers.delete(gameInfo.roomName);
    this.prismaGameService.updateGame(gameInfo);
  }

  async getMatchHistory(intraId: number): Promise<any> {
    console.log('GameService.getMatchHistory userId', intraId);

    const matches = await this.prismaGameService.getMatchHistory(intraId);
    return matches;
  }

  async getGameStatus(intraId: number): Promise<any> {
    console.log('GameService.getGameStatus userId', intraId);

    const game = await this.prismaGameService.get_games_in_progress(intraId);
    console.log("games in get game status:", game);
    if (game == null) {
      return { "playing": false };
    }
    else {
      return { "playing": true };
    }
  }
}
