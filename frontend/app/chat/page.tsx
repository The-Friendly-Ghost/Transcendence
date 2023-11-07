"use client"

/* Import Styles */
import "@styles/containers.css";
import "@styles/fonts.css";
import "@styles/buttons.css";

import { io } from "socket.io-client";
import { useEffect } from "react";

export default function chat_page() {

    useEffect(() => {
        const socket = io("http://localhost:3000");
        // Use the socket object for your socket.io logic here
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