"use server";

import { api } from "@/api/protected.api";

export const blockContact = async (data: { contactUserId: string }) => {
  try {
    const res = await api.patch("/contact/block", data);
    const _data = res.data;
    return _data;
  } catch (err: any) {
    const { success, message } = err.response.data;
    return {
      success,
      message: message ?? "Error blocking contact",
    };
  }
};
