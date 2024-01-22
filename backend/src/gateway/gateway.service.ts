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
  }

  async remove_socket_from_user(intraId: number) {
    this.userBySocket.delete(intraId);
  }

  async get_socket_from_user(intraId: number): Promise<Socket> {
    return this.userBySocket.get(intraId);
  }

  async get_user_by_socket_map(): Promise<Map<number, Socket>> {
    return this.userBySocket;
  }
}
