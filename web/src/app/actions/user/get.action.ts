"use server";

import { api } from "@/api/protected.api";
import { redirect } from "next/navigation";
import { success } from "zod";

export const getUser = async () => {
  let accountNotFound = false;
  try {
    const res = await api.get("/user");
    const user = res.data;
    return { success: true, user, message: user.message as string };
  } catch (err: any) {
    if (err.response.status === 404) accountNotFound = true;
    else
      return {
        success: false,
        message:
          (err.response.data.message as string) ?? "Error getting your account",
      };
  }
  if (accountNotFound) {
    redirect("/account/create");
  }
  return { success: false, message: "Account not found" };
};
