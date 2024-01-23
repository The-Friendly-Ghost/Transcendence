"use client"

/* Import Styles */
import "@styles/containers.css";
import "@styles/fonts.css";
import "@styles/buttons.css";

/* Import React capabilities or library objects */
import { use, useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";

/* Import Components */
import { SingleTab } from "@components/common/Tabs";
import { SettingsTab } from "@components/chat/SettingsTab/settings";
import { GroupsTab } from "@components/chat/Groups/GroupsTab";

/* Import Functions */
import { getCookie } from "@app/ServerUtils";
import { fetchIntraName, setupWebSocket } from "./utils";
import DirectTab from "@components/chat/DirectTab/DirectTab";
import { useSocket } from "@contexts/SocketContext";
import { connect } from "http2";

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
  // The socket to send and receive messages
  const socket: Socket | null = useSocket();

  /* **************** */
  /* UseEffect hooks */
  /* ************** */

  useEffect(() => {
    fetchIntraName(getCookie, setUserName, setIntraId);
    // This will run when the socket connects
    socket?.on('connect', () => {
      console.log('Socket connected');
      // Set up your chat listener here
      console.log("setup chat listener");
      socket.on('onMessage', (data: any) => {
        setMessageReceived(prevMessages => [...prevMessages, data.userName + " : " + data.msg]);
      });
    });

    // This will run when the socket disconnects
    socket?.on('disconnect', () => {
      console.log('Socket disconnected');
      // Remove your chat listener here
      socket.off('onMessage');
    });

    // Clean up function
    return () => {
      // Remove the listeners when the component unmounts
      socket?.off('connect');
      socket?.off('disconnect');
      socket?.off('onMessage');
    };
  }, [socket]);

//   useEffect(() => {
//     console.log("useEffect chatSocket: ");
//     socket?.emit("test", {"test": "test"});
//     console.log(socket);
//     if (socket !== null && socket.connected === false)
//     {
//       console.log("socket is not connected try to connect");
//       socket.connect();
//     }
//     if (socket !== null && socket.connected === true)
//     {
//       console.log("setup chat listener");
//       socket.on('onMessage', (data: any) => {
//         setMessageReceived(prevMessages => [...prevMessages, data.userName + " : " + data.msg]);
//       });
//     }
//     return () => {
//       console.log("remove chat listener");
//       socket?.off('onMessage');
//     };
//     // checkReceivedMessage(chatSocket || null, setMessageReceived);
// }, [socket]);

  // useEffect(() => {
  //   console.log(socket?.connected);
  // }, [socket?.connected]);


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
                chatSocket={socket}
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
                chatSocket={socket}
                myIntraId={intraId}
                messageReceived={messageReceived}
                setMessageReceived={setMessageReceived}
              />
            )}
            {toggleTab === 3 && (
              <SettingsTab
                setUserName={setUserName}
                chatSocket={socket}
                userName={userName}
                intraId={intraId}
              />
            )}
        </div>
      </div>
    </section>
  );
}
