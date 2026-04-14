"use server";

import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/constants/auth";
import { cookies } from "next/headers";

const getAccessToken = async () => {
  const store = await cookies();
  return store.get(ACCESS_TOKEN)?.value;
};
const getRefreshToken = async () => {
  const store = await cookies();
  return store.get(REFRESH_TOKEN)?.value;
};

const setAccessToken = async (token: string) => {
  const store = await cookies();

  store.set(ACCESS_TOKEN, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 5,
    path: "/",
  });
};

const setRefreshToken = async (token: string) => {
  const store = await cookies();

  store.set(REFRESH_TOKEN, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
};

export { setAccessToken, setRefreshToken, getAccessToken, getRefreshToken };
