"use server"

/* Import Functions */
import { get, post } from "@utils/request/request";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";

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