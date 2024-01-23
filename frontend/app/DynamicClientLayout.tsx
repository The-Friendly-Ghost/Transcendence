"use client";
import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { isLoggedIn } from "@utils/isLoggedIn";
import Navbar from "@components/navbar/Nav";
import Login from "@components/login/Login";
import { getUserInfo } from "./ServerUtils";

function ClientSideLayout
({ children }: { children: React.ReactNode }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [userInfo, setUserInfo] = useState<any>([]);

   // This useEffect is used to get the chat rooms from the backend
   useEffect(() => {
    getUserInfo().then((userInfo) => {
      setUserInfo(userInfo);
    });
  }, []);

  useEffect(() => {
    const checkLoggedIn = async () => {
      const result = await isLoggedIn();
      setLoggedIn(result);
    };

    checkLoggedIn();
  }, []);

  useEffect(() => {
    if (loggedIn) {
      const url: string = `${process.env.BACKEND_URL}` + '/gateway';
      const ns = io(url , {
        query: { token: userInfo.intraId}
      });
      ns.on('onConnection', (data) => {
        console.log("socket connected with server")
        console.log(data)
    });
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