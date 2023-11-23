import { OnModuleInit } from '@nestjs/common';
import {
  ConnectedSocket,
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
  handleMessage(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    // this.server.emit('message', message);
    client.join("hoi");
    console.log("CLIENT _____________\n" + client.id);
    console.log("message object:", data);
    this.server.emit('onMessage', {
      content: data,
    });
    // client.broadcast.emit('onMessage', { content: data });
  }
}
