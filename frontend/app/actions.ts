"use server";

import { post } from "@utils/request/request";
import { useRouter } from "next/navigation";

export async function verifyTfaCode(prevState: any, formData: FormData) {
  const router = useRouter();

  console.log("createTodo");
  const data = formData.get("tfa_code");
  let tfa_code: string;
  if (!data) {
    tfa_code = "";
  } else {
    tfa_code = data.toString();
  }

  const res: Response = await post("/auth/2fa/verify", tfa_code);
  if (res.status === 201) {
    router.push("/");
  }
  return res;
}
