export class Invite{
    id: number;
    senderId: number;
    receiverId: number;
    state: string;
    constructor(id: number, senderId: number, receiverId: number, state: string, gameId: number) {
        this.id = id;
        this.senderId = senderId;
        this.receiverId = receiverId;
        this.state = state;
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
}
