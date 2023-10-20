import { cookies } from "next/headers";

export async function get(endpoint: string): Promise<Response> {
  console.log("request get");
  const token: string | undefined = await getJWT();
  console.log("token", token);

  const url: string = `${process.env.BACKEND_URL}${endpoint}`;
  console.log("url", url);

  const response: Response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  // console.log("response", response);
  return response;
}

export async function post(endpoint: string, value: string): Promise<Response> {
  console.log("request post");

  const url: string = `${process.env.BACKEND_URL}${endpoint}`;

  const response: Response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(value),
  });

  return response;
}

export async function getJWT(): Promise<string | undefined> {
  const ck = cookies();
  const token = ck.get("jwt");

  return token?.value;
}
