import { OnModuleInit } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Server, Socket } from 'socket.io';
import { chatDto } from './dto';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  cors: {
    origin: '*'
  }
})
export class ChatGateway {
  constructor(
    private chat: ChatService,
  ) {}
  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket) {
    // console.log('connected, user: ', client);
    console.log('intraId: ', client.handshake.query.token);
    console.log('socketId: ', client.id);
    const intraId = Number(client.handshake.query.token);
    await this.chat.addSocketToUser(intraId, client).catch((err) => {
      console.log(err);
    });
  }

  @SubscribeMessage('newMessage')
     handleMessage(client, body) {
    // this.server.emit('message', message);
    console.log("message object:", body);
    console.log("client:", client);
    this.server.to(body.destination).emit('onMessage', {
      content: body,
    });
  }
}
