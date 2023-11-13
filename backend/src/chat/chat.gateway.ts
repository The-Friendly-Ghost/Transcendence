import { OnModuleInit } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { chatDto } from './dto';

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
    console.log('handshake: ', client.handshake.query.token);
  }

  // onModuleInit() {
  //   this.server.on('connection', (socket) => {
  //     console.log(socket.id);
  //     console.log('connected');
  //   });
  // }

  @SubscribeMessage('newMessage')
  handleMessage(client: Socket, @MessageBody() body: chatDto) {
    // this.server.emit('message', message);
    console.log(body);
    this.server.emit('onMessage', {
      content: body,
    });
  }
}
