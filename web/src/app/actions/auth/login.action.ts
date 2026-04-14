"use server";

import { authAPI } from "@/api/auth.api";

export const loginUser = async (data: { phone: string }) => {
  try {
    const res = await authAPI.post("/login", data);
    const { message, success } = res.data;
    return { success, message };
  } catch (err: any) {
    const { message, success } = err.response.data;
    return { message, success };
  }
};
