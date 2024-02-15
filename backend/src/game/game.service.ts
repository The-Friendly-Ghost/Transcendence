import { Injectable } from '@nestjs/common';
import { PrismaGameService } from './prisma';
import { GameInfo, User } from '@prisma/client';
import { GameManager } from './gamemanager';
import { create } from 'domain';
import { clear } from 'console';
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
    private userService: UserService) {

    }
  private pendingIntraId: number;
  private pendingClient: Socket;
  private gamesInfo: GameInfo[];
  private gameManagers: Map<string, GameManager> = new Map();
  private invites: Map<number, Invite> = new Map();

  async onModuleInit() {
    this.gateway.server.on('connection', this.setupConnection.bind(this));
    // this.gateway.server.on('disconnect', this.disconnect_from_game.bind(this));
  };

  setupConnection(client: Socket) {
    client.on('queueGame', (data: any) => {
      console.log("data:", data);
      this.queueGame(client, data);
    });
    client.on('testGame', (data: any) => {
      console.log("data:", data);
      this.testGame(client, Number(data.userId));
    });
    client.on('leaveQueue', (data: any) => {
      console.log("data:", data);
      this.leaveQueue(client, Number(data.userId));
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
    if (this.pendingIntraId == p1) {
      this.pendingIntraId = null;
      this.pendingClient = null;
    }
    console.log("Test Game:")
    gameInfo = await this.create_game(p1, p1);
    client.emit('gameroom', gameInfo.roomName);
    gameManager = new GameManager(gameInfo, this.gatewayService, this.gateway, this.cleanupGame.bind(this), this.startGameCallback.bind(this));
    this.gameManagers.set(gameInfo.roomName, gameManager);
    console.log(gameInfo);
  };

  async queueGame(client: Socket, data: any) {
    console.log("queueGame", data);
    this.joinQueue(client, parseInt(data.userId as unknown as string));
    console.log("User queued:", data);
    client.emit('queueUpdate', {
      queueStatus: "joined queue"
    });
  };

  async leaveQueue(client: Socket, data: any) {
    console.log("leaveQueue");
    console.log(data);
    let userId = parseInt(data.userId as unknown as string);
    if (this.pendingIntraId == userId || this.pendingClient == client) {
      this.pendingIntraId = null;
      this.pendingClient = null;
    }
    console.log("User left queue:", data);
    client.emit('queueUpdate', {
      queueStatus: "left queue"
    });
  }

  async joinQueue(client: Socket, intraId: number) {
    console.log('GameService.joinQueue userId', intraId);
    // Check if player was invited to a game
    const invite = await this.prismaGameService.findInvite({where: {OR: [{ receiverId: intraId}, {senderId: intraId}]}});
    console.log("invite:", invite);
    if (invite != null && (invite.state == "ACCEPTED" || invite.state == "PENDING")) {
      console.log("User was invited to a game");
      client.emit('queueUpdate', "Joining game from invite");
      if (invite.state == "ACCEPTED") {
        await this.start_game(invite.senderId, invite.receiverId, this.gatewayService.get_socket_from_user(invite.senderId), this.gatewayService.get_socket_from_user(invite.receiverId));
        // invite.state = "FINISHED";
        await this.prismaGameService.updateInvite({where: {id: invite.id}, data: {state: "FINISHED"}});
      }
      return;
    }
    // Check if player is already in game
    const game = await this.prismaGameService.findGame({ userId: intraId });
    if (game != null && game.state != "FINISHED") {
      client.emit('queueUpdate', "You are already in a game");
      client.emit('gameroom', game.roomName);
      console.log(intraId, "is already in a game");
      return;
    }

    // Check if a player is in queue already, if not add player to queue
    if (this.pendingIntraId == null && !Number.isNaN(intraId)) {
      this.pendingIntraId = intraId;
      this.pendingClient = client;
      client.emit('queueUpdate', "Added to queue");
    }
    else if (this.pendingIntraId != intraId && !Number.isNaN(intraId)) {
      console.log("Found 2 users starting a game");
      client.emit('queueUpdate', "Found a player starting game");
      await this.start_game(intraId, this.pendingIntraId, client, this.pendingClient);
      this.pendingIntraId = null;
      this.pendingClient = null;
    }
    else {
      console.log("User is already in queue");
      client.emit('queueUpdate', "You are already in queue");
    }
  }

  async start_game(p1: number, p2: number, client1: Socket, client2: Socket) {
    let gameInfo: GameInfo;
    let gameManager: GameManager;

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

  /* Invite player takes an senderId and a receiverId.
    Validates that the receiverId is online.
    Creates a new invite object and adds it to the invites map.
    send a notification to the receiverId that they have been invited to a game using sockets.
    The event is "invite". The data is the inviteId and the senderId.
    Returns if the invite was successful or not and why and if succesful the inviteId.
  */
  async invitePlayer(senderId: number, receiverId: number) {

    const socket: Socket = await this.gatewayService.get_socket_from_user(receiverId);
    if (socket === undefined) {
      return { "success": false, "reason": "User is not online" };
    }

    let inviteInfo = await this.prismaGameService.createInvite({
      senderId: senderId,
      receiverId: receiverId,
      state: "PENDING"
    });
    if (inviteInfo === undefined) {
      return { "success": false, "reason": "Invite not created" };
    }
    let invite: Invite = new Invite(inviteInfo.id, senderId, receiverId);

    let inviteId = invite.getId();
    console.log("inviteplayer inviteId", inviteId);
    let senderName = (await this.userService.getUser(senderId)).name;
    socket.emit("invite", {inviteId, senderId, senderName});
    this.invites.set(inviteId, invite);

    return { "success": true, "inviteId": invite.getId() };
  };

  async acceptInvite(inviteId: number, receiverId: number) {
    console.log("acceptInvite");
    console.log("inviteId", inviteId);
    console.log("intraId", receiverId);
    let invite = this.invites.get(inviteId);
    if (invite === undefined) {
      console.log("Invite not found");
      return { "success": false, "reason": "Invite not found" };
    }
    if (invite.getReceiverId() !== receiverId) {
      console.log("Invite not for this user");
      return { "success": false, "reason": "Invite not for this user" };
    }
    invite.acceptInvite(receiverId);
    // let inviteInfo = await this.prismaGameService.findInvite({ where: { id: inviteId } });
    // console.log("inviteInfo", inviteInfo);
    // inviteInfo.state = "ACCEPTED";
    this.prismaGameService.updateInvite({where: {id: invite.id}, data: {state: "ACCEPTED"}});
    console.log(invite);
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
