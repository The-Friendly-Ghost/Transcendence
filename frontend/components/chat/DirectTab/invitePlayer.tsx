"use server";
import { get } from "@utils/request/request";


export async function invitePlayer(otherIntraId: any): Promise<any> {
    console.log("Making request to invite player");
    const invitePlayerUrl: string = `/game/invitePlayer/${otherIntraId}`;
    const res: Response = await get(invitePlayerUrl);
    let res_json: any = await res.json();
    console.log(res_json);
    return (res_json);

}
// get(`/game/invitePlayer/${otherIntraId}`)
					// .then(response => response.json())
					// .then(data => {
					// 	if (data && data.success) {
					// 		router.push("/play");
					// 	}
					// })
