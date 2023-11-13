"use client"

/* Import Styles */
import "@styles/containers.css";
import "@styles/fonts.css";
import "@styles/buttons.css";

import { io } from "socket.io-client";
import { useEffect } from "react";
import { getCoockie } from '@app/actions'

export default function chat_page() {
    useEffect(() => {
      const fetchData = async () => {
        const intraName = await getCoockie('username');
  
        const socket = io("http://localhost:3000", {
          query: { token: intraName }
        });
  
        // Log a message when the socket connects
        socket.on("connect", () => {
          console.log("Connected to the socket.io server");
        });
  
        // Log a message when the socket disconnects
        socket.on("disconnect", () => {
          console.log("Disconnected from the socket.io server");
        });
  
        // Log any errors that occur
        socket.on("connect_error", (error) => {
          console.log("Connection error", error);
        });
      };
  
      fetchData();
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
                        placeholder="Message"
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