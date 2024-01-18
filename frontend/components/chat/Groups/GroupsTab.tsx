/* Import Components */
import SimpleForm from '@components/common/Forms';
import StandardButton, { SubmitButton } from '@components/common/Buttons';
import InputSimple from '@components/common/Input';

/* Import functions */
import { createChatRoom, getChatRoom } from '../../../app/chat/serverUtils';
import { checkReceivedMessage, sendMessage, setupWebSocket, validateChatroom } from '../../../app/chat/utils';

/* Import React or Library functions */
import React, { use, useEffect, useRef, useState } from 'react';
import ChatRoomOverview from './ChatRoomOverview';
import { ChatProps } from '@types';
import SmallAccordion from '@components/common/Accordion';
import { put } from '@utils/request/request';
import { getCookie } from '@app/ServerUtils';

export function GroupsTab({ setCurrentRoom, currentRoom, chatSocket, userName, myIntraId } 
    : ChatProps)
	: React.JSX.Element
{

    /* ********************* */
    /* Init State Variables */
    /* ******************* */

    const [chatRooms, setChatRooms] = useState<any>([]);
    // The message to send
    const [chatMessage, setChatMessage] = useState("");
    // The messages received. Stored in an array of strings.
    const [messageReceived, setMessageReceived] = useState<string[]>([]);
    // The new room to create
    const [newRoom, setNewRoom] = useState<string>("");
    // Create room error message
    const [createRoomError, setCreateRoomError] = useState<string>("");


    /* ********************* */
    /* UseEffect Hooks      */
    /* ******************* */

    // This useEffect is used to get the chat rooms from the backend
    useEffect(() => {
        getChatRoom().then((availableRooms) => {
            setChatRooms(availableRooms);
        });
    }, []);

    /* This useEffect runs when the chatSocket changes. */
    useEffect(() => {
        checkReceivedMessage(chatSocket || null, setMessageReceived);
    }, [chatSocket]);

    /* This useEffect runs when the messageReceived array changes. 
    It will scroll to the bottom of the message box so that
    the user can always see the latest message. */
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    function scrollToBottom(): void {
        messagesEndRef.current?.scrollIntoView({ behavior: "instant", block: "end" });
    }
    useEffect(scrollToBottom, [messageReceived]);

    /* ********************* */
    /* Return JSX           */
    /* ******************* */
    return (
        <React.Fragment>
        {/* If user is not in a Chatroom Show this code */}
            {currentRoom === "" && (
                <div className='h-full'>

                    <p className='mb-3'>Create New Room</p>
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

                    {/* Show this block if there are chatrooms inside the database */}
                    { Array.isArray(chatRooms) && 
                        (
                            <div className='pb-4'>
                                <p className='my-3'>All chatrooms ({chatRooms.filter((room: any) => !room.isDm).length})</p>
                                <div className='grid grid-cols-1 gap-5'>
                                    {chatRooms.filter((room: any) => !room.isDm).map((room:any, index:number) => (
                                        <ChatRoomOverview 
                                            setCurrentRoom={setCurrentRoom}
                                            key={index}
                                            room={room}
                                            myIntraId={myIntraId}
                                            userName={userName}
                                            chatSocket={chatSocket}
                                        />
                                    ))}
                                </div>
                            </div>
                        )
                    }

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
                                onClick={ async () => {
                                    setCurrentRoom("");
                                    await put(`/chat/leave_chatroom/${currentRoom}`);
                                    window.location.reload();
                                }}
                                text={"Leave " + currentRoom}
                                buttonStyle={"m-0 mr-4 mb-4 p-0 w-full border-white border-[1px] hover:bg-red-700/40 hover:shadow-red-500"}
                            />
                    </div>

                    <div className='w-full'>
                        <div className="chat_messagebox">
                            {messageReceived.map((message, index) => (
                            <p className="text-white" key={index}>{message}</p>
                            ))}
                            
                        </div>

                        <SimpleForm
                            onSubmit={(event:any) => sendMessage(currentRoom, event, chatMessage, chatSocket, userName, myIntraId, setChatMessage)}
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
                        <div ref={ messagesEndRef } />
                    </div>
                </div>
            )}
        </React.Fragment>
    );
    }

export default GroupsTab