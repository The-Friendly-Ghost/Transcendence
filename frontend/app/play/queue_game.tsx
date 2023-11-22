"use server";
import { post, get } from "@utils/request/request";
import React from 'react'

export async function queue_game(): Promise<any> {
    console.log("Queueing for game");
    const queueGameUrl: string = `/game/searchGame`;
    const res: Response = await get(queueGameUrl);
    let res_json: any = await res.json();
    console.log(res_json);
    return (res_json);
};
