/* Import Components */
import { Metadata } from "next";
import Navbar from "@components/navbar/Nav";
import Login from "@components/login/Login";
import { WebSocketContext } from "@contexts/WebSocketContext";

/* Import Functions */
import { isLoggedIn } from "@utils/isLoggedIn";

/* import styles */
import "@styles/containers.css";
import "@styles/fonts.css";
import "@styles/buttons.css";
import "@styles/stars.css";

/* Import React or Library functions */
import React, { useEffect, useState } from "react";

// Metadata for the page
export const metadata: Metadata = {
  title: "Transcendence",
  description: "The Pong Experience",
};

export default async function RootLayout (
  { children }
  : { children: React.ReactNode } )
  : Promise<React.JSX.Element>
{
  const [loggedIn, setLoggedIn] = useState(false);
  const [socket, setSocket] = useState<WebSocket | null>(null);

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
      const url: string = `${process.env.BACKEND_URL}`;
      const ws = new WebSocket(url);
      setSocket(ws);
    } else if (socket) {
      socket.close();
      setSocket(null);
    }
  }, [loggedIn]);

  return (
    <html lang="en" className="text-white">
      <body className="container_full_background">

        {/* Animated Gradient Background with static stars */}
        <div className="auroral_background"></div>
        <div id="stars"></div>

        {/* If the user is logged in, render the Navbar and the children.
        If the user is not logged in, render the Login page */}
        { loggedIn ?
          (
            <React.Fragment>
              <WebSocketContext.Provider value={socket}>
                <Navbar />
                {children}
              </WebSocketContext.Provider>
            </React.Fragment>
          )
          :
          (
            <Login />
          )
        }
      </body>
    </html>
  );
}
