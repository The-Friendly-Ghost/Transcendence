import { OnModuleInit, ParseIntPipe } from '@nestjs/common';
import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { queueGameDto } from './dto';
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

    sendToUser(userId: number, messagetype: string, message: string) {
        this.server.emit(String(userId), {
            messagetype: messagetype, message: message
        });
    }
}
