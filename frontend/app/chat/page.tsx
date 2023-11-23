"use client"
/* Import Styles */
import "@styles/containers.css";
import "@styles/fonts.css";
import "@styles/buttons.css";
/* Import functions and variables */
import { useEffect, useState } from "react";
import { getCookie } from "@app/actions";
import { io, Socket } from "socket.io-client";
/**
 * Function that returns the Chat Page.
 * @returns A JSX Element that represents the Chat Page.
 */
export default function chat_page(): React.JSX.Element {
  /* The state variable that holds the value of the
  input (message) field. */
  const [chatMessage, setChatMessage] = useState("");
  const [intraName, setIntraName] = useState<string | null>(null);
  const [chatSocket, setChatSocket] = useState<Socket | null>(null);
  const [messageReceived, setMessageReceived] = useState("");
  /* The useEffect runs only once on component mount.
  This is because de dependency array is empty.
  ( the [] at the end ) */
  useEffect(() => {
    let socket: Socket;
    // let newIntraName: string;
    async function fetchIntraName(): Promise<void> {
      // newIntraName = await getCookie('intraId');
      setIntraName(await getCookie('intraId'));
    };
    async function setupWebSocket(): Promise<void> {
      socket = io("http://localhost:3000", {
        query: { token: intraName }
      });
      setChatSocket(socket);
    };
    fetchIntraName().then(setupWebSocket);
  }, []);

  useEffect(() => {
    if (chatSocket) {
      chatSocket.on('onMessage', (data: any) => {
        setMessageReceived(data.msg);
        console.log(data);
      });
    }
  }, [chatSocket]);

  async function sendMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log(chatSocket);
    chatSocket?.emit('newMessage', { msg: chatMessage, destination: chatSocket.id });
    setChatMessage("");
  }
  return (
    <section className="container_full_centered">
      <div className="chat_grid">
        <h1> Message: {messageReceived} </h1>
        <form
          className=""
          onSubmit={sendMessage}
        >
          <input
            type={"text"}
            value={chatMessage}
            onChange={e => setChatMessage(e.target.value)}
            className={"p-5 rounded-md text-black w-4/5"}
            placeholder={"Type message here ..."}
          />
          <button
            type="submit"
            className="main_btn w-1/6">
            Send
          </button>
        </form>
      </div>
    </section>
  );
}
