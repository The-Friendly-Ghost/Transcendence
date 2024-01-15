"use client";
import { cookies } from "next/headers";
import { post } from "@utils/request/request";
// import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import Canvas from '@components/game/canvas';
import React, { useEffect, useRef, useState } from 'react'
import { reset_game } from "./reset_game";
import { Socket, io } from "socket.io-client";
import { getCookie } from "@app/ServerUtils";
// import { getCookie } from "@app/actions";
import { exists } from "fs";
// import Canvas from './components/game/canvas'

export default function game_page(): React.JSX.Element {

    async function resetGames() {
        console.log("Resetting all games");
        const res: any = await reset_game();
        console.log(res);
        // console.log("Resetting games");
    }

    const [intraName, setIntraName] = useState<string | null>(null);
    const gameSocketRef = useRef<Socket | null>(null);
    const [messageReceived, setMessageReceived] = useState("");
    const [queueStatus, setQueueStatus] = useState(false);
    const [gameRoom, setGameRoom] = useState<number | null>(null);
    /* The useEffect runs only once on component mount.
    This is because de dependency array is empty.
    ( the [] at the end ) */
    async function fetchIntraName(): Promise<void> {
        setIntraName(await getCookie('intraId'));
    };

    // Setup websocket if intraName is set
    useEffect(() => {
        let socket: Socket;

        async function setupWebSocket(): Promise<void> {
            socket = io(process.env.BACKEND_URL, {
                query: { token: intraName }
            });
            gameSocketRef.current = socket;
        }
        if (intraName !== null && gameSocketRef.current === null) {
            console.log("Setting up socket");
            setupWebSocket();
        }

        return () => {
            console.log("unmount");
            if (gameSocketRef.current) {
                console.log("Disconnecting socket");
                gameSocketRef.current.disconnect();
                gameSocketRef.current.close();
            }
        }

    }, [intraName]);

    // Fetch intra name on mount
    useEffect(() => {
        async function fetchData(): Promise<void> {
            if (intraName === null) {
                console.log("Fetching intra name");
                await fetchIntraName();
            }
        }
        fetchData();
    }, []);

    // Setup websocket queue listeners
    useEffect(() => {
        if (gameSocketRef.current) {
            gameSocketRef.current.on('queueStatus', (data: any) => {
                console.log(data);
            });
            gameSocketRef.current.on(String(intraName), (data: any) => {
                console.log(data);
                if (data.messagetype === "gameroom") {
                    console.log("game room");
                    setGameRoom(data.message);
                    console.log(gameRoom);
                }
            });
        }
    }, [gameSocketRef.current, intraName]);

    // Setup websocket gameroom listeners
    useEffect(() => {
        if (gameSocketRef.current) {
            if (gameRoom) {
                console.log("Got gameroom");
                gameSocketRef.current.on(String(gameRoom), (data: any) => {
                    console.log(data);
                });
            }
        }
    }, [gameRoom, gameSocketRef.current]);

    // start queue
    async function startQueue() {
        console.log(gameSocketRef.current);
        if (gameSocketRef.current) {
            gameSocketRef.current.emit('queueGame', { userId: intraName, destination: gameSocketRef.current.id });
        }
    }

    return (
        <section>
            <button
                type="button"
                className="main_btn w-1/2"
                onClick={() => startQueue()}
            >
                Enter Queue
            </button>
            <button
                type="button"
                className="main_btn w-1/2"
                onClick={resetGames}
            >
                resetGames
            </button>
            <Canvas className="webgl" />
        </section>
    );
}
