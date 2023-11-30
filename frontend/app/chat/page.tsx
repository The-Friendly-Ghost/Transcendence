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
import { SingleTab, TabsOverview } from "@components/tabs";

/* Import actions */
import { getCookie } from "@app/actions";
import { changeUserName, sendMessage, fetchIntraName, setupWebSocket, checkReceivedMessage } from "./actions";

/**
 * Function that returns the Chat Page.
 * @returns A JSX Element that represents the Chat Page.
 */
export default function chat_page(): React.JSX.Element {

  /* ********************* */
  /* Init State Variables */
  /* ******************* */

  // The message to send
  const [chatMessage, setChatMessage] = useState("");
  // The user name of the user
  const [userName, setUserName] = useState<string | null>(null); 
  // The New user name of the user
  const [newUserName, setNewUserName] = useState<string | null>(null);
  // The 42 intraId of the user. This Id will stay the same, even if the user changes his name.
  const [intraId, setIntraId] = useState<string | null>(null);
  // The socket to send and receive messages
  const [chatSocket, setChatSocket] = useState<Socket | null>(null);
  // The messages received. Stored in an array of strings.
  const [messageReceived, setMessageReceived] = useState<string[]>([]);
  // Set the toggle tab
  const [toggleTab, setToggleTab] = useState<number>(1);

  /* **************** */
  /* UseEffect hooks */
  /* ************** */

  /* This useEffect runs only once on component mount. */
  useEffect(() => 
  {
    fetchIntraName(getCookie, setUserName, setIntraId)
    .then(() => {setupWebSocket(userName, setChatSocket)});
  }, []);

  /* This useEffect runs when the chatSocket changes. */
  useEffect(() => {
    checkReceivedMessage(chatSocket, setMessageReceived);
  }, [chatSocket]);

  /* This useEffect runs when the messageReceived array changes. 
  It will scroll to the bottom of the message box so that
  the user can always see the latest message. */
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  function scrollToBottom(): void {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }
  useEffect(scrollToBottom, [messageReceived]);

  /* ***************** */
  /* Return Component */
  /* *************** */

  return (
    <section className="container_full_centered debug_blue">
      <div className="chat_grid debug_red">
        <TabsOverview toggleId={"chat_tabs"}>
          <SingleTab 
            title={"Groups"} 
            onClick={ () => setToggleTab(1) } 
            style="w-1/3" />
          <SingleTab 
            title={"Direct"} 
            onClick={ () => setToggleTab(2) } 
            style="w-1/3" />
          <SingleTab 
            title={"Settings"} 
            onClick={ () => setToggleTab(3) } 
            style="w-1/3" />
        </TabsOverview>
        
        <div id="chat_tabs debug_red">
    <div className={toggleTab === 1 ? "" : "hidden " + "p-4 rounded-lg bg-gray-50 dark:bg-gray-800"} id="Groups" role="tabpanel" aria-labelledby="Groups-tab">
        <p className="text-sm text-gray-500 dark:text-gray-400">Groups Tab</p>
    </div>
    <div className={toggleTab === 2 ? "" : "hidden " + "p-4 rounded-lg bg-gray-50 dark:bg-gray-800"} id="Direct" role="tabpanel" aria-labelledby="Direct-tab">
        <p className="text-sm text-gray-500 dark:text-gray-400">DM Tab</p>
    </div>
    <div className={toggleTab === 3 ? "" : "hidden " + "p-4 rounded-lg bg-gray-50 dark:bg-gray-800"} id="Settings" role="tabpanel" aria-labelledby="Settings-tab">
        <p className="text-sm text-gray-500 dark:text-gray-400">Settings Tab</p>
    </div>
   
</div>

        {/* <Accordion 
          summary={"Change Username"}
          content={
            <div>
              <SimpleForm
                onSubmit={(event) => changeUserName(event, newUserName, setUserName, chatSocket, userName, intraId, setNewUserName)}
                content={
                  <div className="border-t flex">
                    <InputSimple 
                      input={newUserName} 
                      setInput={setNewUserName}
                      placeholder={"Type new username here ..."}
                    />
                    <StandardButton text={"Change"} />
                  </div>
                }
              />
            </div>
          }
        />

        <div className="chat_messagebox">
          {messageReceived.map((message, index) => (
            <p className="" key={index}>{message}</p>
          ))}
          <div ref={ messagesEndRef } />
        </div>

        <SimpleForm
          onSubmit={(event) => sendMessage(event, chatMessage, chatSocket, userName, intraId, setChatMessage)}
          content={
              <div className="border-t flex">
              <InputSimple 
                input={chatMessage} 
                setInput={setChatMessage}
                placeholder={"Type message here ..."}
              />
              <SubmitButton />
            </div>

          }
        /> */}
      </div>
    </section>
  );
}
