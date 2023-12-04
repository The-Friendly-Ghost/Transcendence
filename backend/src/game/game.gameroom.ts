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

export class gameRoom {
    roomName: string;
    @WebSocketServer()
    server: Server;

    constructor(roomName: string) {
        console.log("gameRoom constructor");
        this.roomName = roomName;
    }

    async handleConnection(client: Socket) {
        console.log('connected, user: ', client);
        console.log('intraId: ', client.handshake.query.token);
    }

    @SubscribeMessage('action')
    handleMessage(client: Socket, @MessageBody() body: gameDto) {
        // this.server.emit('message', message);
        console.log("message object:", body);
        this.server.to(body.destination).emit('onMessage', {
            content: body,
        });
    }
}
