import { getCoockie } from "@app/actions";
import { get } from "./request/request";

export async function isLoggedIn(): Promise<boolean> {
  const TfaValidated: string = await getCoockie("TfaValidated");

  console.log("isLoggedIn TfaValidated", TfaValidated);
  if (TfaValidated === "true") {
    return true;
  }

  return get("/auth/validate").then((res) => {
    console.log("isLoggedIn res", res.status);
    console.log("isLoggedIn res.text", res.statusText);
    if (res.status === 200) {
      return true;
    } else {
      return false;
    }
  });
}
