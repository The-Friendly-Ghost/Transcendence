"use client";
import React, { useEffect, useRef, useState } from 'react'
import { reset_game } from "./reset_game";
import { Socket, io } from "socket.io-client";
import { getCookie, getUserInfo } from "@app/ServerUtils";
import GameComponent from "@components/game/game";
import { useSocket } from '@contexts/SocketContext';

export default function game_page(): React.JSX.Element {
    // const
    const [intraId, setIntraId] = useState<string | null>(null);
    const [userName, setUserName] = useState<string | null>(null);
    const [queueStatus, setQueueStatus] = useState(false);
    const [gameRoom, setGameRoom] = useState<number | null>(null);
    const socket = useSocket();

    /**
    *
    * @param getCookie Get the cookie from the browser
    * @param setUserName Set the user name
    * @param setIntraId Set the intraId
    */
    async function fetchUserInfo(
    getCookie: (name: string) => Promise<string>,
    setUserName: React.Dispatch<React.SetStateAction<string | null>>,
    setIntraId: React.Dispatch<React.SetStateAction<string | null>>
  )
  : Promise<string>
{
    const newUserName = await getCookie('username');
    setUserName(newUserName);
    const newIntraId = await getCookie('intraId');
    setIntraId(newIntraId);
    return (newIntraId);
  }

    async function test() {
        console.log(getUserInfo());
    }

    async function resetGames() {
        console.log("Resetting all games");
        const res: any = await reset_game();
        console.log(res);
    }

    async function setupListeners(socket: Socket) {
        console.log("setup game listeners");
        socket.emit('queueGame', {userId: intraId});
        socket.on('queueUpdate', (data: any) => {
            console.log(data);
        });
        socket.on('gameroom', (data: any) => {
            console.log("game room");
            console.log(data);
            setGameRoom(data);
            // console.log(gameRoom);
        });
        // socket.on('gameUpdate', (data: any) => {
        //     console.log(data);
        // });
    };

    /* **************** */
    /* UseEffect hooks  */
    /* **************** */
    useEffect(() => {
        fetchUserInfo(getCookie, setUserName, setIntraId);
    }, [socket]);

    useEffect(() => {
        if (!intraId) {
            return;
        }
        // This will run when the socket connects
        socket?.on('connect', () => {
            console.log('Socket connected');
            // Set up your game listeners here
            setupListeners(socket);
        });

        // This will run when the socket disconnects
        socket?.on('disconnect', () => {
            console.log('Socket disconnected');
            // Remove your game listeners here
            socket.off('queueUpdate');
        });

        // Check if the socket is already connected when the component mounts
        if (socket?.connected) {
            console.log('Socket already connected');
            // Set up your game listeners here
            setupListeners(socket);
        }

        // Clean up function
        return () => {
            // Remove the listeners when the component unmounts
            socket?.emit('leaveQueue', {userId: intraId});
            socket?.off('connect');
            socket?.off('disconnect');
            socket?.off('queueUpdate');
            socket?.off('gameUpdate');
            socket?.off('gameroom');
        };
    }, [socket, intraId]);

    // start queue
    async function startQueue() {
        console.log(socket);
        if (socket) {
            socket.emit('queueGame', {userId: intraId});
        }
    }

    async function testGame() {
        console.log(socket);
        if (socket) {
            console.log("test game");
            socket.emit('testGame', {userId: intraId});
        }
    }

    return (
        <section>
            {/* <button
                type="button"
                className="main_btn w-1/2"
                onClick={() => startQueue()}
            >
                Enter Queue
            </button> */}
            <button
                type="button"
                className="main_btn w-1/2"
                onClick={resetGames}
            >
                resetGames
            </button>
            <button
                type="button"
                className="main_btn w-1/2"
                onClick={() => testGame()}
            >
                Test game
            </button>
            <GameComponent className="webgl" user={intraId} socket={socket} gameRoom={gameRoom} />
        </section>
    );
}
