"use server";

import { api } from "@/api/protected.api";
import { UserDetails } from "@/types/chatroom";
import { redirect } from "next/navigation";
import { success } from "zod";

export const createContact = async (data: {
  firstName: string;
  lastName: string;
  phone: string;
}): Promise<{
  createdBy?: string;
  contactId?: string;
  chatroomId?: string;
  other?: UserDetails;
  success: boolean;
  message: string;
}> => {
  try {
    const res = await api.put("/contact", data);
    const _data = res.data;
    return _data;
  } catch (err: any) {
    const { success, message } = err.response.data;
    return {
      success,
      message: message ?? "Error creating contact",
    };
  }
};
