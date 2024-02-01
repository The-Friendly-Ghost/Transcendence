export class Invite{
    id: number;
    senderId: number;
    receiverId: number;
    state: string;
    constructor(id: number, senderId: number, receiverId: number) {
        this.id = id;
        this.senderId = senderId;
        this.receiverId = receiverId;
        this.state = "PENDING";
        // this.id = Math.floor(Math.random() * 1000000000);
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

    public acceptInvite(receiverId: number) {
        // this.receiverId = receiverId;
        if (this.receiverId === receiverId)
            this.state = "ACCEPTED";
    }
}
