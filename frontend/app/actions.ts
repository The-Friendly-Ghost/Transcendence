"use server";

import { post } from "@utils/request/request";
import { cookies } from "next/headers";

export async function getCoockie(name: string): Promise<string> {
  const ck = cookies();
  // console.log("getCoockie", name, ck);
  const coockie_object = ck.get(name);

  console.log("getCoockie", name, coockie_object);
  let value: string;
  if (coockie_object) {
    value = coockie_object.value;
  } else {
    value = "";
  }

  console.log("getCoockie", name, value);
  return value;
}

export async function verifyTfaCode(tfa_code: string): Promise<boolean> {
  const intraId: string = await getCoockie("intraId");
  const endpoint: string = `/auth/2fa/verify/${intraId}/${tfa_code}`;
  console.log("verifyTfaCode endpoint", endpoint);

  const res: Response = await post(endpoint);

  console.log("verifyTfaCode res", res.status);
  if (res.status === 201) return true;
  return false;
}
