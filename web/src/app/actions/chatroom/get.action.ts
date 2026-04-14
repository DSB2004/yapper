"use server";

import { api } from "@/api/protected.api";

export const getChatrooms = async () => {
  try {
    const res = await api.get("/chatroom");
    const data = res.data;

    return { ...data, chats: data.chats ?? [] };
  } catch (err: any) {
    const { success, message } = err.response.data;

    return {
      chats: [],
      success,
      message: message ?? "Error fetching chatrooms",
    };
  }
};
