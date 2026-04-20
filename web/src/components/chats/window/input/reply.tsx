"use client";
import React, { useMemo } from "react";
import { useWindow } from "../provider";
import { useChatroom } from "@/provider/chatroom.provider";
import { useUserStore } from "@/store/user.store";
import { X } from "lucide-react";
import { useMessageStore } from "@/store/message.store";

export default function Reply() {
  const { replyTo, setReplyTo } = useWindow();
  const { chatroom } = useChatroom();
  const { data: user } = useUserStore();
  const { data: messages } = useMessageStore();

  /* ---------------- FIND MESSAGE ---------------- */
  const message = useMemo(() => {
    if (!replyTo) return null;

    return messages?.find(
      (m) =>
        m.publicId === replyTo.messageId && m.chatroomId === replyTo.chatroomId,
    );
  }, [replyTo, messages]);

  /* ---------------- FIND SENDER ---------------- */
  const sender = useMemo(() => {
    if (!message) return null;

    const found = chatroom?.participants.find((p) => p.userId === message.by);

    if (!found) return "Unknown";

    return found.userId === user?.userId ? "You" : found.name;
  }, [message, chatroom, user]);

  if (!replyTo || !message) return null;

  return (
    <div className="flex items-center justify-between bg-muted px-3 py-2 border-l-4 border-primary rounded-sm m-3 mb-0">
      {/* LEFT */}
      <div className="flex flex-col overflow-hidden">
        <span className="text-xs font-medium text-primary">{sender}</span>

        <span className="text-sm text-muted-foreground truncate max-w-[240px]">
          {message.text || "Attachment"}
        </span>
      </div>

      {/* RIGHT (CLOSE) */}
      <button
        onClick={() => setReplyTo(null)}
        className="ml-3 p-1 rounded-full hover:bg-background transition"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
