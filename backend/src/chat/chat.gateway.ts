import { OnModuleInit } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { chatDto } from './dto';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  cors: {
    origin: '*'
  }
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket) {
    console.log('connected, user: ', client);
    console.log('intraId: ', client.handshake.query.token);
  }

  @SubscribeMessage('newMessage')
  handleMessage(client: Socket, @MessageBody() body: chatDto) {
    // this.server.emit('message', message);
    console.log("message object:", body);
    this.server.to(body.destination).emit('onMessage', {
      content: body,
    });
  }
}
