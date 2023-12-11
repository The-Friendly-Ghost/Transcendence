"use server"

import { get, post, put } from "@utils/request/request";

export async function getChatRoom(): Promise<any> {
    const url: string = `/chat/get_all_chatrooms`;
    const res: Response = await get(url);
    let res_json: any = await res.json();
    // console.log(res);
    // console.log(res_json);
    return res_json;
}

export async function createChatRoom(name: string): Promise<any> {
    // console.log(name);
    // console.log("createChatRoom ACTIVATED -----------------------");
    const url: string = `/chat/create_chatroom/` + name;
    // console.log("This is the URL: " + url + "!");
    const res: Response = await put(url);
    let res_json: any = await res.json();
    console.log("-------------------------------" , res_json , "-------------------------------");
    // console.log(res_json);
    return res_json;
}