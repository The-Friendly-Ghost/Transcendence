"use server";
import { post, get } from "@utils/request/request";
import React from 'react'

export async function queue_game() {
    console.log("Queueing for game");
    const queueGameUrl: string = `/game/searchGame`;
    const res: Response = await get(queueGameUrl);
    console.log(await res.json());
};
