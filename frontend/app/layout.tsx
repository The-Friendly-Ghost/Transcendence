/* Import Components */
import { Metadata } from "next";
import Navbar from "@components/navbar/Nav";
import Login from "@components/login/Login";
import ClientSideLayout from "./DynamicClientLayout";

/* Import Functions */
import { isLoggedIn } from "@utils/isLoggedIn";

/* import styles */
import "@styles/containers.css";
import "@styles/fonts.css";
import "@styles/buttons.css";
import "@styles/stars.css";

/* Import React or Library functions */
import React from "react";
import { PopupProvider } from "@components/providers/PopupProvider";

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
  return (
    <html lang="en" className="text-white">
      <body className="container_full_background">

        {/* Animated Gradient Background with static stars */}
        {/* <div className="auroral_background"></div> */}
        <div id="stars"></div>

        {/* If the user is logged in, render the Navbar and the children.
        If the user is not logged in, render the Login page */}
        {
          <React.Fragment>
            <PopupProvider>
              <ClientSideLayout>
                {children}
              </ClientSideLayout>
            </PopupProvider>
          </React.Fragment>
        }
      </body>
    </html>
  );
}
