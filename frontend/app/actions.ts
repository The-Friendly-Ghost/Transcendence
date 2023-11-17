"use server"

import { post } from "@utils/request/request";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";

/**
 * Gets a cookie from the backend API.
 * @param name the name of the specific cookie to get. 
 * @returns the value of the cookie with the specified name.
 */
export async function getCookie(name: string): Promise<string> 
{
  const cookie: RequestCookie | undefined = cookies().get(name);
  console.log(cookie);
  return ( cookie ? cookie.value : "" );
}

/**
 * 
 * @param tfa_code 
 * @returns 
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
  console.log("verifyTfaCode key_values", keyValues);

  // set the cookie to the client side...
  console.log("end verifyTfaCode ===========================\n");
  if (res.status === 201) {
    const ck = cookies();
    ck.set("TfaValidated", keyValues.TfaValidated);
    return true;
  }
  return false;
}
