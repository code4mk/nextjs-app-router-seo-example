// src/lib/axios-server.ts
import { cookies } from "next/headers";
import axiosInstance from "./axios";

export async function getServerAxios() {
  const cookieStore = await cookies();
  const token = cookieStore.get("refresh_token")?.value;
  console.log("token", token);
  const instance = axiosInstance;
  if (token) {
    instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
  return instance;
}