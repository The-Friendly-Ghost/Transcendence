"use client";
import { cookies } from "next/headers";
import { post } from "@utils/request/request";
// import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import Canvas from '@components/game/canvas';
import React from 'react'
import { queue_game } from "./queue_game";
// import Canvas from './components/game/canvas'


export default function game_page(): React.JSX.Element {

    async function click() {
        console.log("Queueing for game front");
        const res: any = await queue_game();
        console.log(res);
        console.log("Done with queue");
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
            <Canvas className="webgl" />
        </section>
    );
}
