/* Import Components */
import { Root } from "postcss";
import { Metadata } from "next";
import Navbar from "@components/nav";

/* Import Global Variables */
import { isLoggedIn } from "@utils/isLoggedIn";
import Login from "@components/login";

/* import styles */
import "@styles/containers.css";
import "@styles/fonts.css";
import "@styles/buttons.css";
import "@styles/stars.css";
import React from "react";

export const metadata: Metadata = {
  title: "Transcendence",
  description: "The Pong Experience",
};

export default async function RootLayout (
  { children }
  : { children: React.ReactNode } ) 
  : Promise<React.JSX.Element>
{
  return (
    <html lang="en" className="text-white">
      <body className="container_full_background">
        <div className="auroral_background"></div>
        <div id="stars"></div>
        { await isLoggedIn() ? 
          (
            <React.Fragment>
              <Navbar />
              {children}
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
