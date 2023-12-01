import { OnModuleInit } from '@nestjs/common';
import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { gameDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { GameService } from './game.service';

@WebSocketGateway({
    cors: {
        origin: '*'
    }
})
export class GameGateway {
    constructor(
        private game: GameService
    ) { }
    @WebSocketServer()
    server: Server;

    async handleConnection(client: Socket) {
        console.log('connected, user: ', client);
        console.log('intraId: ', client.handshake.query.token);
        this.game.joinQueue(Number(client.handshake.query.token));
    }

    async handleDisconnect(client: Socket) {
        console.log('intraId: ', client.handshake.query.token, " disconnected");
        this.game.disconnect_from_game(Number(client.handshake.query.token));
    }

    @SubscribeMessage('newGameMessage')
    handleMessage(client: Socket, @MessageBody() body: gameDto) {
        // this.server.emit('message', message);
        console.log("message object:", body);
        this.server.to(body.destination).emit('onGameMessage', {
            content: "hello",
        });
    }
}
