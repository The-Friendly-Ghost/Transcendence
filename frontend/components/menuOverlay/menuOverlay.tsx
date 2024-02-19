"use client"

import { Dispatch, SetStateAction, use, useEffect, useState } from "react";
import { Socket } from "socket.io-client";

interface MenuOverlayProps {
    visibility: boolean;
    socket: Socket | null;
    user: string | null;
    gameRoom: number | null;
}

function queueUpdateHandler(data: any, setStatusMessage: Dispatch<SetStateAction<string>>) {
    console.log(data);
    if (String(data.status) == "IN_QUEUE") {
        console.log("In queue...");
        setStatusMessage("In queue...\n Waiting for other players to queue...");
    }
    else if (String(data.status) == "LEFT_QUEUE") {
        console.log("Left queue...");
        setStatusMessage("Not in queue.");
    }
    else if (String(data.status) == "IN_GAME") {
        console.log("Joined game...");
        setStatusMessage("Joined game...");
    }
}

function joinQueue(socket: Socket | null, user: string | null, setStatusMessage: Dispatch<SetStateAction<string>>) {
    setStatusMessage("Joining queue...");
    if (socket !== null) {
        socket.emit('queueGame', { userId: user });
        console.log("joining queue");
    }
}

function MenuOverlay({ visibility, socket, user, gameRoom }: MenuOverlayProps) {
    const [overlayVisible, setOverlayVisible] = useState(false);
    const [statusMessage, setStatusMessage] = useState("Not in queue.");
    const queueUpdate = (data:any) => queueUpdateHandler(data, setStatusMessage)
    useEffect(() => {

        socket?.on('connect', () => {
            // console.log("connected");
            // Set up your game listeners here
            socket?.on('queueUpdate', queueUpdate);
        });
        // This will run when the socket disconnects
        socket?.on('disconnect', () => {
            // Remove your game listeners here
            socket?.off('queueUpdate', queueUpdate);
        });
        if (socket?.connected) {
            // console.log('Socket already connected');
            // Set up your game listeners here
            socket?.on('queueUpdate', queueUpdate);
        }

        return () => {
            socket?.off('queueUpdate');
        }
    }, [socket]);

    useEffect(() => {
        if (visibility === true) {
            setOverlayVisible(true);
        } else {
            setOverlayVisible(false);
        }
    }, [visibility]);

    useEffect(() => {
        if (gameRoom !== null) {
            setOverlayVisible(false);
        } else {
            setOverlayVisible(true);
        }
    }, [gameRoom]);

    return (
        <div>
            {overlayVisible && (
                <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-purple-600/20 p-3 rounded-md backdrop-blur-md shadow-lg drop-shadow h-1/2 w-1/2'>
                    <h1 className="text-center text-md font-semibold text-wrap">Play Menu</h1>
                    <div className="flex flex-col justify-center basis-1/2 gap-5 pt-3">
                        <button className="bg-gray-600/80 py-5 rounded-md hover:bg-gray-500" onClick={() => {
                            joinQueue(socket, user, setStatusMessage);
                        }}>Join Queue</button>
                        <button className="bg-gray-600/80 py-5 rounded-md hover:bg-gray-500" onClick={() => {
                            console.log("clicked");
                            console.log(socket);
                            if (socket !== null) {
                                socket.emit('leaveQueue', { userId: user });
                                console.log("leaving queue");
                            }
                        }}>Leave Queue</button>
                    </div>
                    <h1 className="py-10 text-center text-md font-semibold text-wrap">{statusMessage}</h1>
                </div>
            )}
        </div>
    );
};

export default MenuOverlay;
