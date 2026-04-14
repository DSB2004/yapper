"use server";

import { api } from "@/api/protected.api";

export const getMessages = async ({ chatroomId }: { chatroomId: string }) => {
  try {
    const res = await api.get("/message", { params: { chatroomId } });
    const data = res.data;
    return { ...data, messages: data.messages ?? [] };
  } catch (err: any) {
    const { success, message } = err.response.data;
    return {
      chats: [],
      success,
      message: message ?? "Error fetching messages",
    };
  }
};
