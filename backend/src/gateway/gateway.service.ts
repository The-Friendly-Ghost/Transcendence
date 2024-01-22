import { Injectable } from "@nestjs/common";
import { Socket } from "socket.io";

@Injectable()
export class GatewayService {
    constructor(
      ) {}
  private userBySocket = new Map<number, Socket>();

  async add_socket_to_user(intraId: number, client: Socket) {
    this.userBySocket.set(intraId, client);
    // console.log("current userBySocket map:", this.userBySocket);
    console.log("map size after login:", this.userBySocket.size);
  }

  async remove_socket_from_user(intraId: number) {
    this.userBySocket.delete(intraId);
    console.log("map size after logout:", this.userBySocket.size);
  }

  async get_socket_from_user(intraId: number): Promise<Socket> {
    console.log("intraId in get socket:", intraId);
    console.log("map in get socket:", this.userBySocket);
    return this.userBySocket.get(intraId);
  }

  async get_user_by_socket_map(): Promise<Map<number, Socket>> {
    return this.userBySocket;
  }
}