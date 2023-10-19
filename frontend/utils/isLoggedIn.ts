import { get } from "./request/request";

export async function isLoggedIn(): Promise<boolean> {
  return get("auth/validate").then((res) => {
    if (res.status === 200) {
      return true;
    } else {
      return false;
    }
  });
}
