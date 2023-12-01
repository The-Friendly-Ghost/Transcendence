"use server";
import { get } from "@utils/request/request";
import React from 'react'

export async function reset_game(): Promise<any> {
    console.log("Making request to reset games");
    const resetGamesUrl: string = `/game/resetGames`;
    const res: Response = await get(resetGamesUrl);
    let res_json: any = await res.json();
    console.log(res_json);
    return (res_json);
};
