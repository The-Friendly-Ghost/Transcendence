"use client"

/* Import Styles */
import "@styles/containers.css";
import "@styles/fonts.css";
import "@styles/buttons.css";

/* Import functions, components and variables */
import { useEffect, useState, useRef } from "react";
import { getCookie } from "@app/actions";
import { io, Socket } from "socket.io-client";
import { InputSimple } from "@components/input";
import StandardButton, { SubmitButton } from "@components/buttons";
import Accordion from "@components/Accordion";
import SimpleForm from "@components/Forms";

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

  /* **************** */
  /* UseEffect hooks */
  /* ************** */

  /* This useEffect runs only once on component mount.
  This is because de dependency array is empty.
  ( the [] at the end ) */
  useEffect(() => 
  {
    let socket: Socket; // Temporary socket variable
    let newUserName: string; // Temporary intraName variable
    let newIntraId: string; // Temporary intraID variable

    /* This function fetches the intraName and intraID 
    from the cookie and sets it to the state variables */
    async function fetchIntraName(): Promise<void> 
    {
      newUserName = await getCookie('username');
      setUserName(newUserName);
      newIntraId = await getCookie('intraId');
      setIntraId(newIntraId);
    };

    /* This function sets up the websocket connection */
    async function setupWebSocket(): Promise<void> 
    {
      socket = io("http://localhost:3000", {
        query: { token: userName }});
      setChatSocket(socket);
    };

    /* Execute the functions created above in a chain */
    fetchIntraName().then(setupWebSocket);
  }, []);

  /* This useEffect runs when the chatSocket object changes. 
  It will change when a message is received. */
  function checkReceivedMessage(): void
  {
      chatSocket?.on('onMessage', (data: any) => {
        setMessageReceived( prevMessages => [...prevMessages, data.userName + " : " + data.msg] );
      });
  }
  useEffect(checkReceivedMessage, [chatSocket]);

  /* This useEffect runs when the messageReceived array changes. 
  It will scroll to the bottom of the message box so that
  the user can always see the latest message. */
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  function scrollToBottom(): void {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }
  useEffect(scrollToBottom, [messageReceived]);


  /* ***************** */
  /* Helper functions */
  /* *************** */

  /* This function sends a message to the server */
  async function sendMessage(event: React.FormEvent<HTMLFormElement>) : Promise<void> 
  {
    event.preventDefault(); // Prevents the page from reloading
    if (chatMessage === "") // If the message is empty, return
      return ;
    chatSocket?.emit('newMessage', { msg: chatMessage, destination: chatSocket.id, userName: userName, intraId: intraId });
    setChatMessage(""); // Clear the message box
  }

  async function changeUserName(event: React.FormEvent<HTMLFormElement>) : Promise<void>
  {
    event.preventDefault(); // Prevents the page from reloading
    if (newUserName === "") // If the message is empty, return
      return ;
    setUserName(newUserName);
    chatSocket?.emit('newMessage', { msg: "changed name to " + "\"" + newUserName + "\"", destination: chatSocket.id, userName: userName, intraId: intraId });
    setNewUserName(""); // Clear the message box
  }

  /* ***************** */
  /* Return Component */
  /* *************** */

  return (
    <section className="container_full_centered">
      <div className="chat_grid">

        <Accordion 
          summary={"Change Username"}
          content={
            <div>
              <SimpleForm
                onSubmit={changeUserName}
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
          onSubmit={sendMessage}
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
        />
      </div>
    </section>
  );
}
