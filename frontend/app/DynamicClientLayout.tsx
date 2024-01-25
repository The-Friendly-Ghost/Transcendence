"use client";
import React, { use, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { isLoggedIn } from "@utils/isLoggedIn";
import Navbar from "@components/navbar/Nav";
import Login from "@components/login/Login";
import { getUserInfo } from "./ServerUtils";
import { SocketContext } from "@contexts/SocketContext";

function ClientSideLayout
({ children }: { children: React.ReactNode }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [userInfo, setUserInfo] = useState<any>([]);
  const [twoFactorVerified, setTwoFactorVerified] = useState(false);

   useEffect(() => {
    getUserInfo().then((userInfo) => {
      setUserInfo(userInfo);
    });
  }, []);

  useEffect(() => {
    if (userInfo.twoFAEnabled === true) {
      setTwoFactorVerified(true);
    }
  }, [userInfo]);

  useEffect(() => {
    const checkLoggedIn = async () => {
      const result = await isLoggedIn();
      setLoggedIn(result);
    };

    checkLoggedIn();
  }, []);

  useEffect(() => {
    console.log("setup socket");
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
      <SocketContext.Provider value={socket}>
        {loggedIn ? <Navbar /> : <Login />}
        {children}
      </SocketContext.Provider>
    </div>
  );
}

export default ClientSideLayout
;
