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
    constructor(
        private gameService: GameService
    ) { }
    @WebSocketServer()
    server: Server;

    async handleConnection(client: Socket) {
        // console.log('connected, user: ', client);
        console.log('handle connectoin intraId: ', client.handshake.query.token);
    }

    async handleDisconnect(client: Socket) {
        console.log('handle disconnection intraId: ', client.handshake.query.token, " disconnected");
        this.gameService.disconnect_from_game(Number(client.handshake.query.token));
        client.disconnect();
    }

    @SubscribeMessage('queueGame')
    handleMessage(client: Socket, @MessageBody() body: queueGameDto) {
        this.gameService.joinQueue(parseInt(body.userId as unknown as string), this);
        // this.server.emit('message', message);
        console.log("message object:", body);
        this.server.to(body.destination).emit('queueStatus', {
            queueStatus: "joined queue"
        });
        this.server.emit(String(body.userId), {
            queueStatus: "hello?"
        });
    }

    @SubscribeMessage('testGame')
    testGame(client: Socket, @MessageBody() body: queueGameDto) {
        this.gameService.testGame(parseInt(body.userId as unknown as string), this);
        console.log("message object:", body);
        this.server.to(body.destination).emit(String(body.userId), {
            queueStatus: "starting test game"
        });
        this.server.emit(String(body.userId), {
            queueStatus: "hello?"
        });
    }

    @SubscribeMessage('userInput')
    userInput(client: Socket, @MessageBody() body: any) {
        // this.gameService.userInput(body);
        // this.server.emit('message', message);
        // console.log("message object:", body);
        this.gameService.userInput(body);
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
