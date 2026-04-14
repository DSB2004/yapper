"use server";

import axios from "axios";

import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/constants/auth";
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
} from "./cookie.action";
import { redirect } from "next/navigation";
import { authAPI } from "@/api/auth.api";

const validateUser = async () => {
  const _accessToken = await getAccessToken();
  const _refreshToken = await getRefreshToken();
  if (!_refreshToken) redirect("/auth/login");
  let shouldRedirect = false;
  try {
    const res = await authAPI.post("/validate", {
      accessToken: _accessToken,
      refreshToken: _refreshToken,
    });

    const { accessToken, refreshToken } = res.data;
    if (!accessToken || !refreshToken) throw new Error("Failed to get token");
    await setAccessToken(accessToken);
    await setRefreshToken(refreshToken);
    return { accessToken, refreshToken };
  } catch (err: any) {
    shouldRedirect = true;
    console.error("[VALIDATE USER]", err.response.data.message || err.message);
  }
  if (shouldRedirect) redirect("/auth/login");
  return { accessToken: _accessToken, refreshToken: _refreshToken };
};

const isValidUser = async () => {
  const accessToken = await getAccessToken();
  const refreshToken = await getRefreshToken();
  if ((!accessToken && !refreshToken) || !refreshToken) return false;
  return true;
};

export { validateUser, isValidUser };
