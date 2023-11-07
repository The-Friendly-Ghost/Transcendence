import { OnModuleInit } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { chatDto } from './dto';

@WebSocketGateway()
export class ChatGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  // async handleConnection(client: Socket) {
  //   console.log('connected, user: ', client);
  // }

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log(socket.id);
      console.log('connected');
    });
  }

  @SubscribeMessage('newMessage')
  handleMessage(client: Socket, @MessageBody() body: chatDto) {
    // this.server.emit('message', message);
    console.log(body);
    this.server.emit('onMessage', {
      content: body,
    });
  }
}
