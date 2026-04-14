"use server";

import { authAPI } from "@/api/auth.api";
import { setAccessToken, setRefreshToken } from "./cookie.action";
export const verifyUser = async (data: { phone: string; otp: string }) => {
  try {
    const res = await authAPI.post("/verify", data);
    const { message, success, accessToken, refreshToken } = res.data;
    console.log(res.data);
    await setAccessToken(accessToken);
    await setRefreshToken(refreshToken);
    return { success, message };
  } catch (err: any) {
    const { message, success } = err.response.data;
    return { message, success };
  }
};
