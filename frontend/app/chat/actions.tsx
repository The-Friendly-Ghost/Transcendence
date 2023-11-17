import { intraName, setChatSocket } from '@app/g_vars';
import { io } from "socket.io-client";

/**
 * Function that sets up the socket connection to the backend API.
 */
export async function setupWebSocket() : Promise<void> {

    /*  We create a socket connection to the backend API. */
    const socket = io("http://localhost:3000", {
      query: { token: intraName }
    });
    setChatSocket( socket );
  
    /* Log a message to the browser when the socket connects */
    socket.on("connect", () => {
      console.log("Socket created with ID: ", socket.id);
    });
    socket.on("connect_error", (error) => {
      console.log("Socket creation error: ", error);
    });
}