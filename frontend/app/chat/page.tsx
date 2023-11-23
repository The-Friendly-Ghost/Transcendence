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
    let newIntraName: string;
    async function fetchIntraName(): Promise<void> {
      newIntraName = await getCookie('intraId');
      setIntraName(newIntraName);
    };
    async function setupWebSocket(): Promise<void> {
      socket = io("http://localhost:3000", {
        query: { token: newIntraName }
      });
      setChatSocket(socket);
    };
