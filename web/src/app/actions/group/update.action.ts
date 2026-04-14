"use server";

import { api } from "@/api/protected.api";
import { redirect } from "next/navigation";
import { success } from "zod";

export const updateGroup = async (data: {
  name: string;
  description: string;
  icon: string;
  groupId: string;
}) => {
  try {
    const res = await api.patch("/group", data);
    const { success, message } = res.data;
    return { success: true, message };
  } catch (err: any) {
    const { success, message } = err.response.data;
    return {
      success,
      message: message ?? "Error updating group",
    };
  }
};
