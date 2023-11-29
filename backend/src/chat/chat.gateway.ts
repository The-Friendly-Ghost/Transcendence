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
    console.log('socketId: ', client);
    const intraId = Number(client.handshake.query.token);
    await this.chat.add_socket_to_user(intraId, client).catch((err) => {
      console.log(err);
    });
  }

  @SubscribeMessage('newMessage')
    async handleMessage(client, body) {
    // this.server.emit('message', message);
    console.log("message object:", body);
    console.log("client:", client);
    console.log("ceated chatroom:", await this.chat.create_chatroom(parseInt(body.intraId), body.destination).catch((e: Error) => {
      throw e.message;
    }));
    this.chat.add_message(body.destination, body.msg, body.userName).catch((err) => {throw err;});
    this.server.to(body.destination).emit('onMessage', {
      content: body,
    });
  }
}
