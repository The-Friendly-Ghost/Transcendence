"use server"

/* Import Functions */
import { get, post } from "@utils/request/request";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";
import { io, Socket } from "socket.io-client";

/**
 * Gets a cookie from the backend API.
 * @param name the name of the specific cookie to get.
 * @returns the value of the cookie with the specified name.
 */
export async function getCookie(name: string): Promise<string> {
  const cookie: RequestCookie | undefined = cookies().get(name);
  return (cookie ? cookie.value : "");
}

/**
 * Sends a request to the backend API to verify the TFA code.
 * @param tfa_code the TFA code to verify.
 * @returns true if the TFA code is valid, false otherwise.
 */
export async function verifyTfaCode(tfa_code: string): Promise<boolean> {

  const intraId: string = await getCookie("intraId");
  const endpoint: string = `/auth/2fa/verify/${intraId}/${tfa_code}`;
  const res: Response = await post(endpoint);


  // get the cookies from the response...
  const my_cookies: string[] = res.headers.getSetCookie();
  const values: string[] = my_cookies.map((ck) => {
    const value: string = ck.split(";")[0];
    return value;
  });
  const keyValues: { [key: string]: string } = {};
  values
    .map((value) => value.split("="))
    .filter((pair) => pair[1] !== undefined)
    .forEach((pair) => {
      keyValues[pair[0]] = pair[1];
    });
  // console.log("verifyTfaCode key_values", keyValues);

  // set the cookie to the client side...
  // console.log("end verifyTfaCode ===========================\n");
  if (res.status === 201) {
    const ck = cookies();
    ck.set("TfaValidated", keyValues.TfaValidated);
    return true;
  }
  return false;
}

/**
 * Sends a request to the backend to get the user's information.
 * If no intraId is specified, the request will be made to get
 * the current user's information. Otherwise, the request will
 * be made to get the information of the user with the specified
 * intraId.
 * @param intraId the intraId of the user to get information for.
 * @returns the user's information.
 */
export async function getUserInfo(intraId?: number): Promise<any>
{

  if (intraId)
  {
    const endpoint: string = `/user/getUser/` + intraId;
    const res: Response = await get(endpoint);
    return res.json();
  }
  else
  {
    const endpoint: string = `/user/getMe`;
    const res: Response = await get(endpoint);
    return res.json();
  }
}

export async function getAllUsers()
: Promise<any> {
    const url: string = `/user/get_all_users`;
    const res: Response = await get(url);
    let res_json: any = await res.json();
    return res_json;
}

export async function getMatchHistory()
: Promise<any> {
    const url: string = `/game/match_history`;
    const res: Response = await get(url);
    let res_json: any = await res.json();
    return res_json;
}

export async function addNewFriend( intraID: string )
: Promise<any> {
    const url: string = `/user/addFriend/` + intraID;
    const res: Response = await post(url);
    let res_json: any = await res.json();
    return res_json;
}

export async function changeUsername( newUsername: string )
: Promise<any> {
    const url: string = `/user/setUserName/` + newUsername;
    const res: Response = await post(url);
    let res_json: any = await res.json();
    return res_json;
}

/**
 *
 * @param intraId The user name of the user
 * @param setChatSocket The function to set the socket
 */
export async function setupWebSocket(
  intraId: string | null,
  socketRef: React.MutableRefObject<Socket | null>,
  namespace: string)
{
  const url: string = `${process.env.BACKEND_URL}` + '/' + namespace;
  console.log("intraId in setupWebSocket: " + intraId);
  const socket = io(url , {
    query: { token: intraId }
  });
  console.log("socket : " + socket);
  console.log("url : " + url);
  socketRef.current = socket;
}

/**
 * Sends a request to the backend to get the user's Online/offline status.
 * @param intraId the intraId of the user to get information for.
 * @returns the user's status
 */
export async function getStatus(intraId: number): Promise<any>
{
    const endpoint: string = `/gateway/status/` + intraId;
    const res: Response = await get(endpoint);
    return res.json();
}

/**
 */
export async function getSecret(intraId: number): Promise<any>
{
    const endpoint: string = `/auth/2fa/secret/` + intraId;
    const res: Response = await get(endpoint);
    return res.json();
}
