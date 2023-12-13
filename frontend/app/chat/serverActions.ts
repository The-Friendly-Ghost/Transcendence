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

export async function createChatRoom( name: string )
: Promise<any> {
    const url: string = `/chat/create_chatroom/` + name;
    const res: Response = await put(url);
    let res_json: any = await res.json();
    return res_json;
}
