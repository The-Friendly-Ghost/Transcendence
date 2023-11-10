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
  constructor(
    private jwtService: JwtService,
  ) {}
  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket) {
    console.log('connected, user: ', client);
    let intraId;
    console.log('handshake: ', client.handshake.query);
    // try {
    //   intraId = await this.jwtService.verify(
    //     client.handshake.auth.token, { secret: process.env.JWT_SECRET }
    //   );
    // } catch(err) {
    //   console.log('unauthenticated client');
    //   return ;
    // }
    console.log('user ', intraId, ' connected');
    client.disconnect();
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
