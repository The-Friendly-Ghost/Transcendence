export class Invite{
    id: number;
    senderId: number;
    receiverId: number;
    state: string;
    constructor(senderId: number) {
        this.senderId = senderId;
        this.state = "PENDING";
        this.id = Math.floor(Math.random() * 1000000000);
    }

    public getId(): number {
        return this.id;
    }

    public getSenderId(): number {
        return this.senderId;
    }

    public getReceiverId(): number {
        return this.receiverId;
    }

    acceptInvite(receiverId: number) {
        this.receiverId = receiverId;
        this.state = "ACCEPTED";
    }
}
