"use server";
import { post, get } from "@utils/request/request";
import React from 'react'

export async function queue_game() {
    console.log("Queueing for game");
    const queueGameUrl: string = `/game/getGame/:1`;
    const res: Response = await get(queueGameUrl);
    console.log(res);
};
