"use server";

import { api } from "@/api/protected.api";
import { redirect } from "next/navigation";
import { success } from "zod";

export const createUser = async (data: {
  firstName: string;
  lastName: string;
  avatar?: string;
}) => {
  try {
    const res = await api.put("/user", data);
    const { success, message } = res.data;
    return { success: true, message };
  } catch (err: any) {
    const { success, message } = err.response.data;
    return {
      success,
      message: message ?? "Error creating your account",
    };
  }
};
