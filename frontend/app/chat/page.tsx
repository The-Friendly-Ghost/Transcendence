"use client"

/* Import Styles */
import "@styles/containers.css";
import "@styles/fonts.css";
import "@styles/buttons.css";

/* Import React capabilities or library objects */
import { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";

/* Import Components */
import { SingleTab } from "@components/common/Tabs";
import { SettingsTab } from "@components/chat/SettingsTab/settings";
import { GroupsTab } from "@components/chat/Groups/GroupsTab";

/* Import Functions */
import { getCookie } from "@app/ServerUtils";
import { fetchIntraName, setupWebSocket } from "./utils";
import DirectTab from "@components/chat/DirectTab/DirectTab";

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
  const chatSocket = useRef<Socket | null>(null);
  // Set the toggle tab
  const [toggleTab, setToggleTab] = useState<number>(1);
  // The current room the user is in
  const [currentRoom, setCurrentRoom] = useState<string>("");
  // The messages received. Stored in an array of strings.
  const [messageReceived, setMessageReceived] = useState<string[]>([]);

  /* **************** */
  /* UseEffect hooks */
  /* ************** */

  /* This useEffect runs only once on component mount. */
  useEffect(() =>
  {
    console.log("setup web socket")
    if (chatSocket.current === null)
    {
      fetchIntraName(getCookie, setUserName, setIntraId).then((intraId) => {setupWebSocket(intraId, chatSocket)});
      console.log("setup web socket but actually")
      console.log(chatSocket)
    }
  }, []);

  useEffect(() => {
    console.log("useEffect chatSocket: ");
    console.log(chatSocket.current);
    if (chatSocket.current?.connected == true)
    {
      chatSocket.current.on('onMessage', (data: any) => {
      setMessageReceived(prevMessages => [...prevMessages, data.userName + " : " + data.msg]);
      });
    }
    // checkReceivedMessage(chatSocket || null, setMessageReceived);
}, [chatSocket.current?.connected]);

  /* ***************** */
  /* Return Component */
  /* *************** */

  return (
    <section className="container_full_centered justify-start pt-12">
      <div className="chat_grid">
        <ul className="tab_ul">
          <SingleTab
            title={"Groups"}
            onClick={ () => {setToggleTab(1); setCurrentRoom(""); setMessageReceived([])}}
            style={`w-1/3 ${toggleTab === 1 ? " active_tab" : ""}`} />
          <SingleTab
            title={"Direct"}
            onClick={ () => {setToggleTab(2); setCurrentRoom(""); setMessageReceived([])} }
            style={`w-1/3 ${toggleTab === 2 ? " active_tab" : ""}`} />
          <SingleTab
            title={"Find User"}
            onClick={ () => {setToggleTab(3); setCurrentRoom("")} }
            style={`w-1/3 ${toggleTab === 3 ? " active_tab" : ""}`} />
        </ul>

        <div className="bg-black/20 h-3/6 min-h-[500px] mt-5 rounded-lg p-5 overflow-y-auto">
            {toggleTab === 1 && (
              <GroupsTab
                setCurrentRoom={setCurrentRoom}
                currentRoom={currentRoom}
                userName={userName}
                chatSocket={chatSocket.current}
                myIntraId={intraId}
                messageReceived={messageReceived}
                setMessageReceived={setMessageReceived}
              />
            )}
            {toggleTab === 2 && (
              <DirectTab
                setCurrentRoom={setCurrentRoom}
                currentRoom={currentRoom}
                userName={userName}
                chatSocket={chatSocket.current}
                myIntraId={intraId}
                messageReceived={messageReceived}
                setMessageReceived={setMessageReceived}
              />
            )}
            {toggleTab === 3 && (
              <SettingsTab
                setUserName={setUserName}
                chatSocket={chatSocket.current}
                userName={userName}
                intraId={intraId}
              />
            )}
        </div>
      </div>
    </section>
  );
}
