import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from 'src/chat/chat.service';
import { PrismaChatService } from 'src/chat/prisma/prisma_chat.service';

@WebSocketGateway({
    cors: {
      origin: '*'
    },
    namespace: '/main'
  })
@WebSocketGateway()
export class GatewayGateway {
    constructor(
    private chat: ChatService,
    private prisma_chat: PrismaChatService
    ) {}
    @WebSocketServer()
    server: Server;

    async handleConnection(client: Socket) {
        console.log(client.handshake.query.token, " connected to main gateway");
        // console.log('socket: ', client);
        const intraId = Number(client.handshake.query.token);
        await this.chat.add_socket_to_user(intraId, client).catch((err) => {
            console.log(err);
        });
    }

    @SubscribeMessage('newMessage')
    async handleMessage(client, body) {
        console.log("message object:", body);
        // console.log("ceated chatroom:", await this.chat.create_chatroom(parseInt(body.intraId), body.destination).catch((e: Error) => {
        //   throw e.message;
        // }));
        // this.chat.add_message(body.destination, body.msg, body.userName).catch((err) => {throw err;});
        const is_muted = await this.prisma_chat.is_user_muted(Number(body.intraId), body.destination);
        if (is_muted) {
            body.msg = "You are muted.";
            this.server.to(client.id).emit('onMessage', body);
            return;
        }
        this.server.to(body.destination).emit('onMessage', body);
    }
}
