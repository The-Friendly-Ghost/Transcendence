import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GatewayService } from './gateway.service';

@WebSocketGateway({
    cors: {
      origin: '*'
    }
  })
export class GatewayGateway {
    constructor(
    private gateway: GatewayService,
    ) {}
    @WebSocketServer()
    server: Server;

    async handleConnection(client: Socket) {
        console.log(client.handshake.query.token, " connected to main gateway");
        client.emit('onConnection', "connected to main gateway");
        const intraId = Number(client.handshake.query.token);
        client.on("test", (data: any) => {
            console.log(data);
        });
        // await this.gateway.add_socket_to_user(intraId, client).catch((err) => {
        //     console.log(err);
        // });
    }


    // @SubscribeMessage('newMessage')
    // async handleMessage(client, body) {
    //     console.log("message object:", body);
    //     // console.log("ceated chatroom:", await this.chat.create_chatroom(parseInt(body.intraId), body.destination).catch((e: Error) => {
    //     //   throw e.message;
    //     // }));
    //     // this.chat.add_message(body.destination, body.msg, body.userName).catch((err) => {throw err;});
    //     this.server.to(body.destination).emit('onMessage', body);
    // }

    // @SubscribeMessage('test')
    // async test(client, body) {
    //     console.log("test message:", body);
    //     this.server.to(client.id).emit('onTest', body);
    // }
}
