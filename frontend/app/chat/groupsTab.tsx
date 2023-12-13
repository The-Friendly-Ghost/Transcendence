import SimpleForm from '@components/Forms';
import StandardButton, { SubmitButton } from '@components/buttons';
import InputSimple from '@components/input';
import React, { use, useEffect, useRef, useState } from 'react'
import { Socket } from 'socket.io-client'
import { createChatRoom, getChatRoom } from './serverActions';
import { checkReceivedMessage, sendMessage, validateChatroom } from './actions';

export function GroupsTab({ setCurrentRoom, currentRoom, chatSocket, userName, myIntraId }
	: {  setCurrentRoom: React.Dispatch<React.SetStateAction<string>>, currentRoom: string, 
        chatSocket: Socket | null, userName: string, myIntraId: string})
	: React.JSX.Element
{
    const [chatRooms, setChatRooms] = useState<any>([]);
    // The message to send
    const [chatMessage, setChatMessage] = useState("");
    // The messages received. Stored in an array of strings.
    const [messageReceived, setMessageReceived] = useState<string[]>([]);
    // The new room to create
    const [newRoom, setNewRoom] = useState<string>("");
    // // Create room error message
    const [createRoomError, setCreateRoomError] = useState<string>("");

    // This useEffect is used to get the chat rooms from the backend
    useEffect(() => {
        getChatRoom().then((availableRooms) => {
            setChatRooms(availableRooms);
        });
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

    // console.log(ChatRoomObj);

    return (
        <React.Fragment>
        {/* If user is not in a Chatroom Show this code */}
            {currentRoom === "" && (
                <div className='h-full'>

                    {/* Show this block if there are chatrooms inside the database */}
                    { Array.isArray(chatRooms) && 
                        ( <div>
                            <h2 className="h4_font font-bold pb-4">Joined rooms</h2>
                            {chatRooms.map((room:any, index:number) => (
                                <StandardButton
                                    onClick={ () => { setCurrentRoom(room.name) } }
                                    key={index}
                                    text={room.name}
                                    buttonStyle={"border-white border-[1px] hover:bg-violet-700/40 m-0 mr-4 mb-4"}
                                />
                            ))}
                        </div> )
                    }

                    <div className='pb-5'>
                        <h2 className="h4_font font-bold pb-4">Create a new room</h2>
                        <SimpleForm
                            onSubmit= { (event: any) => { 
                                if (validateChatroom(newRoom, chatRooms, setCreateRoomError) === true)
                                {
                                    setCreateRoomError("");
                                    createChatRoom(newRoom);
                                }
                                else
                                    event.preventDefault();
                            }}
                            content = {
                                <div className="flex">
                                    <InputSimple 
                                        input={newRoom} 
                                        setInput={setNewRoom}
                                        placeholder={"Room name ..."}
                                    />
                                    <StandardButton 
                                        text={"Create"}
                                        buttonStyle={"border-white border-[1px] hover:bg-violet-700/40"}
                                    />
                                </div>
                            }
                        />
                        { createRoomError !== "" && (
                            <p className="text-red-500">{createRoomError}</p>
                        )}
                    </div>
                </div>
            )}

            {/* If user is in a Chatroom Show this code */}
            {currentRoom !== "" && (
                <div className='grid grid-cols-1 h-full content-between'>
                    <div className="grid grid-cols-2 w-full content-center gap-4">
                        <StandardButton
                                onClick={() => {setCurrentRoom("");}}
                                text={"‹ Other Rooms"}
                                buttonStyle={"m-0 mr-4 mb-4 p-0 w-full border-white border-[1px] hover:bg-violet-700/40"}
                            />
                        <StandardButton
                                onClick={() => {setCurrentRoom("");}}
                                text={"Leave " + currentRoom}
                                buttonStyle={"m-0 mr-4 mb-4 p-0 w-full border-white border-[1px] hover:bg-red-700/40 hover:shadow-red-500"}
                            />
                    </div>

                    <div className='w-full'>
                        <div className="chat_messagebox">
                            {messageReceived.map((message, index) => (
                            <p className="text-white" key={index}>{message}</p>
                            ))}
                            <div ref={ messagesEndRef } />
                        </div>

                        <SimpleForm
                            onSubmit={(event:any) => sendMessage(event, chatMessage, chatSocket, userName, myIntraId, setChatMessage)}
                            content=
                            {
                                <div className="flex">
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
                </div>
            )}
        </React.Fragment>
    );
    }

export default GroupsTab