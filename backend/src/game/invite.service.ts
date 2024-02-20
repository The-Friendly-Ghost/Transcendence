import { GatewayService } from "src/gateway/gateway.service";
// import { Invite } from "./invite";
import { Socket } from 'socket.io';
import { PrismaGameService } from "./prisma";
import { UserService } from 'src/user/user.service';
import { Injectable } from "@nestjs/common";
import { GatewayGateway } from "src/gateway/gateway.gateway";
import { GameService } from "./game.service";
import { Invite } from "@prisma/client";

@Injectable()
export class InviteService {
    constructor(
        private readonly prismaGameService: PrismaGameService,
        private gatewayService: GatewayService,
        private gateway: GatewayGateway,
        private userService: UserService,
        private gameService: GameService,
    ) { };

    async onModuleInit() {
        this.gateway.server.on('connection', this.setupListeners.bind(this));
    };

    setupListeners(client: Socket) {
        client.on('checkInvite', (data: any) => {
          this.checkInvite(client, data);
        });
      };

    /* Invite player takes an senderId and a receiverId.
    Validates that the receiverId is online.
    Creates a new invite object and adds it to the invites map.
    send a notification to the receiverId that they have been invited to a game using sockets.
    The event is "invite". The data is the inviteId and the senderId.
    Returns if the invite was successful or not and why and if succesful the inviteId.
    */
    async invitePlayer(senderId: number, receiverId: number) {

        const socket: Socket = this.gatewayService.get_socket_from_user(receiverId);
        if (socket === undefined) {
            return { "success": false, "reason": "User is not online" };
        }

        let inviteInfo = await this.prismaGameService.createInvite({
            senderId: senderId,
            receiverId: receiverId,
            state: "PENDING"
        });
        if (inviteInfo === undefined) {
            return { "success": false, "reason": "Invite not created" };
        }

        let inviteId = inviteInfo.id;
        console.log("inviteplayer inviteId", inviteInfo.id);
        let senderName = (await this.userService.getUser(senderId)).name;
        socket.emit("invite", {inviteId, senderId, senderName});

        return { "success": true, "inviteId": inviteInfo.id };
    };

    async acceptInvite(inviteId: number, receiverId: number) {
        console.log("acceptInvite");
        console.log("inviteId", inviteId);
        console.log("intraId", receiverId);
        let invite = await this.prismaGameService.findInvite({where: {id: inviteId}});
        if (invite === undefined) {
            console.log("Invite not found");
            return { "success": false, "reason": "Invite not found" };
        }
        if (invite.receiverId !== receiverId) {
            console.log("Invite not for this user");
            return { "success": false, "reason": "Invite not for this user" };
        }
        await this.prismaGameService.updateInvite({where: {id: invite.id}, data: {state: "ACCEPTED"}});
        console.log(invite);
        let senderClient = this.gatewayService.get_socket_from_user(invite.senderId);
        let receiverClient = this.gatewayService.get_socket_from_user(receiverId);
        if (senderClient === undefined || receiverClient === undefined) {
            console.log("One or both players are not online");
            return { "success": false, "reason": "One or both players are not online" };
        }
        senderClient.emit('AcceptedInvite', invite);
        receiverClient.emit('AcceptedInvite', invite);
        return { "success": true };
    };

    async checkInvite(client: Socket, data: any) {
        let intraId = Number(data.userId);
        console.log(intraId, data.userId);

        const invite: Invite = await this.prismaGameService.findInvite({
            where: {
                OR: [
                    { receiverId: intraId},
                    {senderId: intraId}
                ],
                state: {
                    not: "FINISHED"
                }
            }});
        console.log("invite:", invite);
        if (invite != null && (invite.state == "ACCEPTED" || invite.state == "PENDING")) {
            console.log("User was invited to a game");
            let receiverUser = await this.userService.getUser(Number(invite.receiverId));
            let senderUser = await this.userService.getUser(Number(invite.senderId));
            if (invite.senderId == intraId) {
                client.emit('queueUpdate', {message: "Joining game from invite", status: "INVITER", inviteId: invite.id, senderName: senderUser.name, receiverName: receiverUser.name});
            } else {
                client.emit('queueUpdate', {message: "Joining game from invite", status: "INVITED"});
            }
            if (invite.state == "ACCEPTED") {
                await this.gameService.start_game(invite.senderId, invite.receiverId);
                await this.prismaGameService.updateInvite({where: {id: invite.id}, data: {state: "FINISHED"}});
            }
            return;
        }
    };
};
