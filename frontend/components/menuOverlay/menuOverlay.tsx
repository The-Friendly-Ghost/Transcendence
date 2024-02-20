"use client"

import { Dispatch, SetStateAction, use, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import "@styles/buttons.css";
import { getUserInfo } from "@app/ServerUtils";

interface MenuOverlayProps {
    visibility: boolean;
    socket: Socket | null;
    user: string | null;
    gameRoom: number | null;
}

async function queueUpdateHandler(data: any, setStatusMessage: Dispatch<SetStateAction<string>>) {
    console.log(data);
    if (String(data.status) == "IN_QUEUE") {
        console.log("In queue...");
        setStatusMessage("In queue...\n Waiting for other players to queue...");
    } else if (String(data.status) == "LEFT_QUEUE") {
        console.log("Left queue...");
        setStatusMessage("Not in queue.");
    } else if (String(data.status) == "IN_GAME") {
        console.log("Joined game...");
        setStatusMessage("Joined game...");
    } else if (String(data.status) == "INVITED") {
        console.log("Invited to game...");
        setStatusMessage("Invited to game...");
    } else if (String(data.status) == "INVITER") {
        console.log("Inviter to game...");
        setStatusMessage("Waiting on " + data.receiverName + " to accept invite...");
    } else if (String(data.status) == "FINISHED") {
        console.log("Game finished...");
        let winnerUser: any = await getUserInfo(data.winner);
        setStatusMessage("Game finished. " + winnerUser.name + " won the game. Final score: " + data.score);
    }
}

function joinQueue(socket: Socket | null, user: string | null, setStatusMessage: Dispatch<SetStateAction<string>>) {
    setStatusMessage("Joining queue...");
    if (socket !== null) {
        socket.emit('queueGame', { userId: user });
        console.log("joining queue");
    }
}

function setup(socket: Socket | null, queueUpdate: any, user: string | null) {
    console.log("setup game listeners");
    if (socket !== null) {
        socket.on('queueUpdate', queueUpdate);
    }
    setTimeout(() => {socket?.emit('checkInvite', { userId: Number(user) })}, 500);

}

function MenuOverlay({ visibility, socket, user, gameRoom }: MenuOverlayProps) {
    const [overlayVisible, setOverlayVisible] = useState<boolean>(false);
    const [statusMessage, setStatusMessage] = useState("Not in queue.");
    const queueUpdate = (data:any) => queueUpdateHandler(data, setStatusMessage)

    useEffect(() => {
        setOverlayVisible(false);
    }, []);

    useEffect(() => {
        socket?.on('connect', () => {
            // console.log("connected");
            // Set up your game listeners here
            setup(socket, queueUpdate, user);
        });
        // This will run when the socket disconnects
        socket?.on('disconnect', () => {
            // Remove your game listeners here
            socket?.off('queueUpdate', queueUpdate);
        });
        if (socket?.connected) {
            // console.log('Socket already connected');
            // Set up your game listeners here
            setup(socket, queueUpdate, user);
        }

        return () => {
            socket?.off('queueUpdate');
        }
    }, [socket, user]);

    useEffect(() => {
        setOverlayVisible(visibility);
    }, [visibility]);

    // If there is a game room, hide the overlay
    // If there is no game room, show the overlay
    // UNLESS the visibility prop is set to false, then hide the overlay
    useEffect(() => {
        if (gameRoom !== null) {
            setOverlayVisible(false);
        } else if (visibility) {
            setOverlayVisible(true);
        }
    }, [gameRoom, visibility]);

    return (
        <div>
            {overlayVisible && (
                <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-violet-100/10 p-3 rounded-md backdrop-blur-md shadow-lg drop-shadow h-1/2 w-1/2'>
                    <h1 className="text-center text-md font-semibold text-wrap">Play Menu</h1>
                    <div className="flex flex-col justify-center basis-1/2 gap-5 pt-3">
                        <button className="main_btn border-gray-700 border drop-shadow bg-col2 hover:bg-cyan-500 hover:shadow-cyan-500 w-full ml-0" onClick={() => {
                            joinQueue(socket, user, setStatusMessage);
                        }}>Join Queue</button>
                        <button className="main_btn border-gray-700 border drop-shadow bg-col2 hover:bg-cyan-500 hover:shadow-cyan-500 w-full ml-0" onClick={() => {
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
