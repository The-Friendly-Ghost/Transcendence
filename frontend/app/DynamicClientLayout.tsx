"use client";
import React, { use, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { isLoggedIn } from "@utils/isLoggedIn";
import Navbar from "@components/navbar/Nav";
import Login from "@components/login/Login";
import { getUserInfo } from "./ServerUtils";
import { SocketContext } from "@contexts/SocketContext";
import { addListener } from "process";
import { usePopup } from "@components/providers/PopupProvider";
import { InvitePopup } from "@components/Popup/popup";
import { useRouter } from "next/navigation";


function ClientSideLayout
({ children }: { children: React.ReactNode }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [userInfo, setUserInfo] = useState<any>([]);
  const [twoFactorVerified, setTwoFactorVerified] = useState(false);
  const { isPopupOpen, openPopup, closePopup } = usePopup();
  const router = useRouter();
  /**
   *
   * @param intraId The user name of the user
   * @param setChatSocket The function to set the socket
  */
 function setupWebSocket(
    intraId: string,
    namespace: string): Socket
  {
    const url: string = `${process.env.BACKEND_URL}` + '/' + namespace;
    const socket = io(url , {
      query: { token: intraId }
    });
    return socket;
  }

  function setupListeners(socket: Socket): void {
    console.log("setup listeners");
    console.log(socket);
    socket.on('onConnection', (data) => {
      console.log("socket connected with server")
      console.log(data)
    });
    socket.on('invite', (data) => {
      // console.log(isPopupOpen)
      openPopup(data);
      console.log("You have been invited to a game by: " + data.senderId)
      // console.log(data)
    });
    socket.on('AcceptedInvite', (data) => {
      console.log("Invite accepted")
      console.log(data)
      if (window.location.pathname == "/play")
      {
        socket.emit('checkInvite', { userId: Number(userInfo.intraId) });
      } else {
        router.push("/play");
      }
    });
  }

  // This useEffect is used to get the chat rooms from the backend
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
      const ns = setupWebSocket(userInfo.intraId, "gateway");
      setupListeners(ns);
      setSocket(ns);
    } else if (socket) {
      // console.log("logged out");
      socket.close();
      setSocket(null);
    }
  }, [loggedIn]);

  return (
    <div>
      <SocketContext.Provider value={socket}>
        {loggedIn && <InvitePopup />}
        {loggedIn ? <Navbar /> : <Login />}
        {children}
      </SocketContext.Provider>
    </div>
  );
}

export default ClientSideLayout
;
