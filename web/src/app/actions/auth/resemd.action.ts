"use server";

import { authAPI } from "@/api/auth.api";
import { setAccessToken, setRefreshToken } from "./cookie.action";
export const resendOTP = async (data: { phone: string }) => {
  try {
    const res = await authAPI.post("/resend", data);
    const { message, success } = res.data;

    return { success, message };
  } catch (err: any) {
    const { message, success } = err.response.data;
    return { message, success };
  }
};
