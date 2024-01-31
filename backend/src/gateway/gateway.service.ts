import { Injectable } from "@nestjs/common";
import { Socket } from "socket.io";

@Injectable()
export class GatewayService {
  private userBySocket: Map<number, Socket>;
    constructor(
      ) {
        this.userBySocket = new Map<number, Socket>();
      }

  async add_socket_to_user(intraId: number, client: Socket) {
    this.userBySocket.set(intraId, client);
    // console.log("current userBySocket map:", this.userBySocket);
    console.log("map after login:", this.userBySocket);
  }

  async remove_socket_from_user(intraId: number) {
    this.userBySocket.delete(intraId);
    console.log("map size after logout:", this.userBySocket.size);
  }

  get_socket_from_user(intraId: number): Socket {
    console.log("intraId in get socket:", intraId);
    console.log("map size get_socket:", this.userBySocket.size);

    return this.userBySocket.get(intraId);
  }

  async get_user_by_socket_map(): Promise<Map<number, Socket>> {
    return this.userBySocket;
  }
}
