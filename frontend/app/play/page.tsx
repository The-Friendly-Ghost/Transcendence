"use client";
import { cookies } from "next/headers";
import { post } from "@utils/request/request";
// import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import Canvas from '@components/game/canvas';
import React, { useEffect, useState } from 'react'
import { queue_game } from "./queue_game";
import { reset_game } from "./reset_game";
import { Socket, io } from "socket.io-client";
import { getCookie } from "@app/actions";
// import Canvas from './components/game/canvas'


export default function game_page(): React.JSX.Element {

    async function click() {
        console.log("Queueing for game front");
        const res: any = await queue_game();
        console.log(res);
        console.log("Done with queue");

    }

    async function resetGames() {
        console.log("Queueing for game front");
        const res: any = await reset_game();
        console.log(res);
        console.log("Done with queue");

    }

    // const [gameMessage, setGameMessage] = useState("");
    const [intraName, setIntraName] = useState<string | null>(null);
    const [gameSocket, setGameSocket] = useState<Socket | null>(null);
    const [messageReceived, setMessageReceived] = useState("");
    /* The useEffect runs only once on component mount.
    This is because de dependency array is empty.
    ( the [] at the end ) */
    useEffect(() => {
        let socket: Socket;
        let newIntraName: string;
        async function fetchIntraName(): Promise<void> {
        newIntraName = await getCookie('intraId');
        setIntraName(await getCookie('intraId'));
        };
        async function setupWebSocket(): Promise<void> {
            socket = io(process.env.BACKEND_URL, {
                query: { token: newIntraName }
            });
            setGameSocket(socket);
        };
        fetchIntraName().then(setupWebSocket);
        setupWebSocket();
    }, []);

    useEffect(() => {
        if (gameSocket) {
            gameSocket.on('onGameMessage', (data: any) => {
                setMessageReceived(data.msg);
                console.log(data);
            });
        }
    }, [gameSocket]);

    async function sendMessage(message: string) {
        // event.preventDefault();
        console.log(gameSocket);
        // setGameMessage(message);
        gameSocket?.emit('newGameMessage', { msg: "test", destination: gameSocket.id });
    }

    return (
        <section>
            <h1> HELLOOOOO </h1>
            <button
                type="button"
                className="main_btn w-1/2"
                onClick={click}
            >
                Play
            </button>
            <button
                type="button"
                className="main_btn w-1/2"
                onClick={() => sendMessage("test")}
            >
                test
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
