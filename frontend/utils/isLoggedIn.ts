"use server";

import { getCookie, getSecret, getTfaEnabled } from "@app/ServerUtils";
import { get } from "./request/request";

export async function isLoggedIn(): Promise<boolean> {
  return get("/auth/validate").then(async (res) => {
    if (res.status !== 200) return false;
    return true;
  });
}

export async function isLoggedInTFA(): Promise<boolean> {
  const intraid: string = await getCookie("intraId");

  const isTfaEnabled: any = await getTfaEnabled(intraid);
  console.log("\n\nisLoggedInTFA isTfaEnabled", isTfaEnabled.TfaEnabled);

  if (!isTfaEnabled.TfaEnabled) {
    return true;
  }

  const TfaEnabled: string = await getCookie("TfaEnabled");
  const TfaValidated: string = await getCookie("TfaValidated");

  console.log("isLoggedInTFA TfaEnabled", TfaEnabled);
  console.log("isLoggedInTFA TfaValidated", TfaValidated);
  return TfaEnabled === "true" && TfaValidated === "true";
}
