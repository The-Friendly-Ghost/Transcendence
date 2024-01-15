import { OnModuleInit, ParseIntPipe } from '@nestjs/common';
import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { gameStateDto, queueGameDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { GameService } from './game.service';

@WebSocketGateway({
    cors: {
        origin: '*'
    }
})
export class GameGateway {
    private connections: Map<number, Socket>;
    constructor(
        private gameService: GameService
    ) {
        this.connections = new Map<number, Socket>();
    }
    @WebSocketServer()
    server: Server;

    async handleConnection(client: Socket) {
        // Add user and socket to connections map
        this.connections.set(Number(client.handshake.query.token), client);
        // Debug log
        console.log('handle connectoin intraId: ', client.handshake.query.token);
        // Join a room that is the same as the user's intraId for 1-to-1 communication
        client.join(String(client.handshake.query.token));
        // Add event listeners
        client.on('queueGame', this.queueGame.bind(this, client));
        client.on('testGame', this.testGame.bind(this, client));
        client.on('userInput', this.userInput.bind(this, client));
    }

    async handleDisconnect(client: Socket) {
        console.log('handle disconnection intraId: ', client.handshake.query.token, " disconnected");
        this.gameService.disconnect_from_game(Number(client.handshake.query.token));
        // Remove user and socket from connections map
        this.connections.delete(Number(client.handshake.query.token));
        client.disconnect();
    }

    queueGame(client: Socket, data: queueGameDto)
    {
        this.gameService.joinQueue(parseInt(data.userId as unknown as string), this);
        console.log("User queued:", data);
        client.emit('queueStatus', {
            queueStatus: "joined queue"
        });
    }

    testGame(client: Socket, data: queueGameDto) {
        this.gameService.testGame(parseInt(data.userId as unknown as string), this);
        console.log("message object:", data);
        client.emit("queueStatus", {
            queueStatus: "starting test game"
        });
    }

    userInput(client: Socket, data: any) {
        this.gameService.userInput(data);
    }

    public updateClients(gameId: number, message: gameStateDto) {
        this.server.emit(String(gameId), {
            type: "gameUpdate", message: message
        });
    }

    public sendToUser(userId: number, type: string, message: any) {
        this.server.emit(String(userId), {
            type: type, message: message
        });
    }
}
