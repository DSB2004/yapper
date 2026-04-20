"use client";
import { useMessageStore } from "@/store/message.store";
import React, { useMemo, useCallback } from "react";
import { useMessageProvider } from "./provider";
import { useChatroom } from "@/provider/chatroom.provider";
import { useUserStore } from "@/store/user.store";

export default function ReplyPreview() {
  const { data: messages } = useMessageStore();
  const { msg } = useMessageProvider();
  const { chatroom } = useChatroom();
  const { data: currentUser } = useUserStore();

  /* ---------------- FIND REPLIED MESSAGE ---------------- */
  const replyToMessage = useMemo(() => {
    if (!msg.replyFor) return null;
    return messages?.find((m) => m.publicId === msg.replyFor);
  }, [msg.replyFor, messages]);

  /* ---------------- FIND SENDER ---------------- */
  const senderName = useMemo(() => {
    if (!replyToMessage) return "";

    const user = chatroom?.participants.find(
      (p) => p.userId === replyToMessage.by,
    );

    if (!user) return "Unknown";

    return user.userId === currentUser?.userId ? "You" : user.name;
  }, [replyToMessage, chatroom, currentUser]);

  /* ---------------- SCROLL TO MESSAGE ---------------- */
  const scrollToMessage = useCallback(() => {
    if (!replyToMessage) return;

    const el = document.getElementById(replyToMessage.publicId);

    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      /* highlight effect */
      el.classList.add("bg-muted/30");

      setTimeout(() => {
        el.classList.remove("bg-muted/30");
      }, 1500);
    }
  }, [replyToMessage]);

  /* ---------------- GUARD ---------------- */
  if (!msg.replyFor || !replyToMessage) return null;

  return (
    <div
      onClick={scrollToMessage}
      className="cursor-pointer mb-1 px-2 py-1 rounded-md border-l-4 border-primary bg-muted/60 hover:bg-muted transition"
    >
      <div className="text-[11px] font-semibold text-primary">{senderName}</div>

      <div className="text-xs text-muted-foreground truncate max-w-[200px]">
        {replyToMessage.text || "Attachment"}
      </div>
    </div>
  );
}
