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
export default function chat_page() : React.JSX.Element 
{
  /* The state variable that holds the value of the 
  input (message) field. */
  const [chatMessage, setChatMessage] = useState( "" );
  const [intraName, setIntraName] = useState<string | null>(null);
  const [chatSocket, setChatSocket] = useState<Socket | null>(null);

  /* The useEffect runs only once on component mount.
  This is because de dependency array is empty. 
  ( the [] at the end ) */
  useEffect( () => {

    let newIntraName: string;
    let socket: Socket;

    async function fetchIntraName() : Promise<void> {
      newIntraName = await getCookie( 'username' );
      setIntraName( newIntraName );
    };

    async function setupWebSocket() : Promise<void> {
      socket = io("http://localhost:3000", {
        query: { token: newIntraName }
      });
      console.log(newIntraName);
      setChatSocket( socket );
    };

    fetchIntraName().then( setupWebSocket );
  }, []);

  return (
    <section className="container_full_centered">
        <div className="chat_grid">
          <ul>
            messages
          </ul>
          <form className="">
            <input 
              type="text" 
              autoComplete="off"
              // value={inputValue}
              // onChange={handleChange}
              className="p-5 rounded-md text-black w-4/5"
              placeholder={intraName ? intraName + ":" : ""}
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