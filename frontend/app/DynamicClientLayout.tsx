"use client";
import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { isLoggedIn } from "@utils/isLoggedIn";
import Navbar from "@components/navbar/Nav";
import Login from "@components/login/Login";

function ClientSideLayout
({ children }: { children: React.ReactNode }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const checkLoggedIn = async () => {
      const result = await isLoggedIn();
      setLoggedIn(result);
    };

    checkLoggedIn();
  }, []);

  useEffect(() => {
    if (loggedIn) {
      // Replace 'ws://your-websocket-url' with your WebSocket URL
      const url: string = `${process.env.BACKEND_URL}` + '/main';
      const ns = io(url , {
        query: { token: 123 }
      });
      ns.on('onconnection', () => {console.log("socket connected with server")});
      setSocket(ns);
    } else if (socket) {
      socket.close();
      setSocket(null);
    }
  }, [loggedIn]);

  return (
    <div>
      {loggedIn ? <Navbar /> : <Login />}
      {children}
    </div>
  );
}

export default ClientSideLayout
;
