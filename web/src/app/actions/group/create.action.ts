"use server";

import { api } from "@/api/protected.api";
import { redirect } from "next/navigation";
import { success } from "zod";

export const createGroup = async (data: {
  name: string;
  description: string;
  icon: string;
  members: string[];
}): Promise<{
  createdBy?: string;
  groupId?: string;
  chatroomId?: string;
  success: boolean;
  message: string;
}> => {
  try {
    const res = await api.put("/group", data);
    const _data = res.data;
    return _data;
  } catch (err: any) {
    const { success, message } = err.response.data;
    return {
      success,
      message: message ?? "Error creating group",
    };
  }
};
