import { GatewayService } from "src/gateway/gateway.service";
import { Invite } from "./invite";
import { Socket } from 'socket.io';
import { PrismaGameService } from "./prisma";
import { UserService } from 'src/user/user.service';
import { Injectable } from "@nestjs/common";

@Injectable()
export class InviteService {
    constructor(
        private readonly prismaGameService: PrismaGameService,
        private gatewayService: GatewayService,
        private userService: UserService,
    ) { };
    private invites: Map<number, Invite> = new Map();


    /* Invite player takes an senderId and a receiverId.
    Validates that the receiverId is online.
    Creates a new invite object and adds it to the invites map.
    send a notification to the receiverId that they have been invited to a game using sockets.
    The event is "invite". The data is the inviteId and the senderId.
    Returns if the invite was successful or not and why and if succesful the inviteId.
    */
    async invitePlayer(senderId: number, receiverId: number) {

        const socket: Socket = await this.gatewayService.get_socket_from_user(receiverId);
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
        let invite: Invite = new Invite(inviteInfo.id, senderId, receiverId);

        let inviteId = invite.getId();
        console.log("inviteplayer inviteId", inviteId);
        let senderName = (await this.userService.getUser(senderId)).name;
        socket.emit("invite", {inviteId, senderId, senderName});
        this.invites.set(inviteId, invite);

        return { "success": true, "inviteId": invite.getId() };
    };

    async acceptInvite(inviteId: number, receiverId: number) {
        console.log("acceptInvite");
        console.log("inviteId", inviteId);
        console.log("intraId", receiverId);
        let invite = this.invites.get(inviteId);
        if (invite === undefined) {
            console.log("Invite not found");
            return { "success": false, "reason": "Invite not found" };
        }
        if (invite.getReceiverId() !== receiverId) {
            console.log("Invite not for this user");
            return { "success": false, "reason": "Invite not for this user" };
        }
        invite.acceptInvite(receiverId);
        this.prismaGameService.updateInvite({where: {id: invite.id}, data: {state: "ACCEPTED"}});
        console.log(invite);
        return true;
    };
};
