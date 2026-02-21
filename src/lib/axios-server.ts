import 'server-only'
import { cookies } from "next/headers";
import axios from "axios";

export async function getServerAxios() {
  const cookieStore = await cookies();
  const token = cookieStore.get("refresh_token")?.value;

  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  return instance;
}
