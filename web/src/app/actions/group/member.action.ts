"use server";

import { api } from "@/api/protected.api";
import { redirect } from "next/navigation";
import { success } from "zod";

export const addMembers = async (data: {
  members: string[];
  groupId: string;
}) => {
  try {
    const res = await api.patch("/member/add", data);
    const { success, message } = res.data;
    return { success: true, message };
  } catch (err: any) {
    const { success, message } = err.response.data;
    return {
      success,
      message: message ?? "Error adding new members",
    };
  }
};

export const removeMembers = async (data: {
  members: string[];
  groupId: string;
}) => {
  try {
    const res = await api.patch("/member/remove", data);
    const { success, message } = res.data;
    return { success: true, message };
  } catch (err: any) {
    const { success, message } = err.response.data;
    return {
      success,
      message: message ?? "Error removing members",
    };
  }
};

export const leaveGroup = async (data: { groupId: string }) => {
  try {
    const res = await api.patch("/member/leave", data);
    const { success, message } = res.data;
    return { success: true, message };
  } catch (err: any) {
    const { success, message } = err.response.data;
    return {
      success,
      message: message ?? "Error leaving",
    };
  }
};
