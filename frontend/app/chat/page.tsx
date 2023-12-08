"use client"

/* Import Styles */
import "@styles/containers.css";
import "@styles/fonts.css";
import "@styles/buttons.css";

/* Import React capabilities or library objects */
import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";

/* Import components */
import { InputSimple } from "@components/input";
import StandardButton, { SubmitButton } from "@components/buttons";
import Accordion from "@components/Accordion";
import SimpleForm from "@components/Forms";
import { SingleTab } from "@components/tabs";
import { SettingsTab } from "./settings";

/* Import actions */
import { getCookie } from "@app/actions";
import { changeUserName, sendMessage, fetchIntraName, setupWebSocket, checkReceivedMessage } from "./actions";
import GroupsTab from "./groupsTab";

/**
 * Function that returns the Chat Page.
 * @returns A JSX Element that represents the Chat Page.
 */
export default function chat_page(): React.JSX.Element {

  /* ********************* */
  /* Init State Variables */
  /* ******************* */

  // The user name of the user
  const [userName, setUserName] = useState<string>(""); 
  // The 42 intraId of the user. This Id will stay the same, even if the user changes his name.
  const [intraId, setIntraId] = useState<string>("");
  // The socket to send and receive messages
  const [chatSocket, setChatSocket] = useState<Socket | null>(null);
  // Set the toggle tab
  const [toggleTab, setToggleTab] = useState<number>(1);
  // The current room the user is in
  const [currentRoom, setCurrentRoom] = useState<string>("");

  /* **************** */
  /* UseEffect hooks */
  /* ************** */

  /* This useEffect runs only once on component mount. */
  useEffect(() => 
  {
    fetchIntraName(getCookie, setUserName, setIntraId)
    .then(() => {setupWebSocket(userName, setChatSocket)});
  }, []);

  /* ***************** */
  /* Return Component */
  /* *************** */

  return (
    <section className="container_full_centered justify-start pt-12">
      <div className="chat_grid">
        <ul className="tab_ul">
          <SingleTab 
            title={"Groups"} 
            onClick={ () => setToggleTab(1) } 
            style={`w-1/3 ${toggleTab === 1 ? " active_tab" : ""}`} />
          <SingleTab 
            title={"Direct"} 
            onClick={ () => setToggleTab(2) } 
            style={`w-1/3 ${toggleTab === 2 ? " active_tab" : ""}`} />
          <SingleTab 
            title={"Settings"} 
            onClick={ () => setToggleTab(3) } 
            style={`w-1/3 ${toggleTab === 3 ? " active_tab" : ""}`} />
        </ul>
        
        <div className="bg-black/20 h-3/6 min-h-[500px] mt-5 rounded-lg p-5">
            {toggleTab === 1 && (
              <GroupsTab 
                setCurrentRoom={setCurrentRoom}
                currentRoom={currentRoom}
                userName={userName}
                chatSocket={chatSocket}
                intraId={intraId}
              />
            )}
            {toggleTab === 2 && (
              <p className="text-sm text-gray-500 dark:text-gray-400">DM Tab</p>
            )}
            {toggleTab === 3 && (
              <SettingsTab
                setUserName={setUserName}
                chatSocket={chatSocket}
                userName={userName}
                intraId={intraId}
              />
            )}
        </div>
      </div>
    </section>
  );
}
