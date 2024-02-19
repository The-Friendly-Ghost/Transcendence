import { GatewayService } from "src/gateway/gateway.service";
import { Invite } from "./invite";
import { Socket } from 'socket.io';
import { PrismaGameService } from "./prisma";
import { UserService } from 'src/user/user.service';
import { GatewayGateway } from "src/gateway/gateway.gateway";
import { GameService } from "./game.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class QueueService {
    constructor(
        private readonly prismaGameService: PrismaGameService,
        private gateway: GatewayGateway,
        private gameService: GameService,
    ) { }
    private pendingIntraId: number;
    private pendingClient: Socket;

    async onModuleInit() {
        this.gateway.server.on('connection', this.setupListeners.bind(this));
    };

    setupListeners(client: Socket) {
        client.on('queueGame', (data: any) => {
          this.queueGame(client, data);
        });
        client.on('leaveQueue', (data: any) => {
          this.leaveQueue(client, Number(data.userId));
        });
      };

    async queueGame(client: Socket, data: any) {
        this.joinQueue(client, parseInt(data.userId as unknown as string));
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
        console.log('QueueService.joinQueue userId', intraId);
        // Check if player was invited to a game
        const invite = await this.prismaGameService.findInvite({where: {OR: [{ receiverId: intraId}, {senderId: intraId}]}});
        console.log("invite:", invite);
        if (invite != null && (invite.state == "ACCEPTED" || invite.state == "PENDING")) {
            console.log("User was invited to a game");
            client.emit('queueUpdate', "Joining game from invite");
            if (invite.state == "ACCEPTED") {
                await this.gameService.start_game(invite.senderId, invite.receiverId);
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
            await this.gameService.start_game(intraId, this.pendingIntraId);
            this.pendingIntraId = null;
            this.pendingClient = null;
        }
        else {
            console.log("User is already in queue");
            client.emit('queueUpdate', "You are already in queue");
        }
    }
}
