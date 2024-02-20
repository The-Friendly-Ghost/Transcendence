"use client";
import React, { useEffect, useState } from 'react'
import { reset_game } from "./reset_game";
import { Socket } from "socket.io-client";
import { getCookie, getUserInfo } from "@app/ServerUtils";
import GameComponent from "@components/game/game";
import MenuOverlay from "@components/menuOverlay/menuOverlay";
import { useSocket } from '@contexts/SocketContext';

export default function game_page(): React.JSX.Element {
    // const
    const [intraId, setIntraId] = useState<string | null>(null);
    const [userName, setUserName] = useState<string | null>(null);
    const [overlayVisible, setOverlayVisible] = useState<boolean>(false);
    const [gameRoom, setGameRoom] = useState<number | null>(null);
    const [gameInfo, setGameInfo] = useState<any | null>(null);
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
    ): Promise<string>
    {
        const newUserName = await getCookie('username');
        setUserName(newUserName);
        const newIntraId = await getCookie('intraId');
        setIntraId(newIntraId);
        return (newIntraId);
    }

    async function resetGames() {
        console.log("Resetting all games");
        const res: any = await reset_game();
        console.log(res);
    }

    async function setupListeners(socket: Socket) {
        console.log("setup game listeners");
        socket.on('gameInfo', (data: any) => {
            console.log("game room");
            console.log(data);
            setGameInfo(data);
            setGameRoom(data.roomName);
            // console.log(gameRoom);
        });
        socket.on('gameOver', (data: any) => {
            console.log("game Over");
            console.log(data);
            setGameRoom(null);
        });
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
            setOverlayVisible(true);
            setupListeners(socket);
        });

        // This will run when the socket disconnects
        socket?.on('disconnect', () => {
            console.log('Socket disconnected');
            setOverlayVisible(false);
            // Remove your game listeners here
        });

        // Check if the socket is already connected when the component mounts
        if (socket?.connected) {
            console.log('Socket already connected');
            // Set up your game listeners here
            setOverlayVisible(true);
            setupListeners(socket);
        }

        // Clean up function
        return () => {
            // Remove the listeners when the component unmounts
            socket?.emit('leaveQueue', {userId: intraId});
            socket?.off('connect');
            socket?.off('disconnect');
            // socket?.off('queueUpdate');
            socket?.off('gameUpdate');
            socket?.off('gameInfo');
        };
    }, [socket, intraId]);

    async function testGame() {
        console.log(socket);
        if (socket) {
            console.log("test game");
            socket.emit('testGame', {userId: intraId});
        }
    }

    return (
        <section>
            {socket && (
                <section>
                    {/* <button
                        type="button"
                        className="main_btn w-1/2"
                        onClick={resetGames}
                    >resetGames
                    </button>
                    <button
                        type="button"
                        className="main_btn w-1/2"
                        onClick={() => testGame()}
                    >Test game
                    </button> */}
                    <MenuOverlay visibility={overlayVisible} socket={socket} user={intraId} gameRoom={gameRoom}/>
                    <GameComponent className="webgl" user={intraId} socket={socket} gameRoom={gameRoom} gameInfo={gameInfo}/>
                </section>
            )}
        </section>
    );
}
