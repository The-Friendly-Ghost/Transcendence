"use server";

import { post } from "@utils/request/request";
import { cookies } from "next/headers";

export async function getCoockie(name: string): Promise<string> {
  console.log("\n start getCoockie ===========================");
  const ck = cookies();
  // console.log("\n\nget all Cookies", ck);
  const coockie_object = ck.get(name);

  console.log("getCookie", name, coockie_object);
  let value: string;
  if (coockie_object) {
    value = coockie_object.value;
  } else {
    value = "";
  }

  console.log("getCookie\n\n", name, value);
  console.log("end getCoockie ===========================\n");
  return value;
}

export async function verifyTfaCode(tfa_code: string): Promise<boolean> {
  console.log("\n start verifyTfaCode ===========================");
  const intraId: string = await getCoockie("intraId");
  const endpoint: string = `/auth/2fa/verify/${intraId}/${tfa_code}`;
  console.log("verifyTfaCode endpoint", endpoint);

  const res: Response = await post(endpoint);
  console.log("verifyTfaCode res", res.status);

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
