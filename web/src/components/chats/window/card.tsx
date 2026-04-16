"use client";
import { useChatroom } from "@/provider/chatroom.provider";
import { useUserStore } from "@/store/user.store";
import { Message } from "@/types/message";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Time from "../common/time";

export function MessageCard({
  prev,
  msg,
}: {
  prev: Message | null;
  msg: Message;
}) {
  const { chatroom: room } = useChatroom();
  const { data: user } = useUserStore();
  if (!room) return <></>;

  const details = useMemo(() => {
    const sender = msg.by;

    const senderDetails = room.participants.find(
      (ele) => ele.userId === sender,
    );
    if (!senderDetails) return { name: "", avatar: "", userId: "", you: false };
    return { ...senderDetails, you: senderDetails.userId === user?.userId };
  }, [user, room, msg]);
  return (
    <div
      className={`flex gap-2 ${details?.you ? "justify-end" : "justify-start"}`}
    >
      <img src={details?.avatar} className="w-8 h-8 rounded-full" />

      <div className="relative max-w-xs">
        <div
          className={`px-3 py-2 rounded-lg text-sm shadow
          ${details?.you ? "bg-secondary rounded-bl-none" : "bg-foreground rounded-br-none text-black"}`}
        >
          {msg.text}
        </div>

        <div className="text-[10px] text-muted-foreground mt-1 text-right">
          <Time time={msg.createdAt}></Time>
        </div>
      </div>
    </div>
  );
}

export function MessageSkeleton({
  align = "left",
}: {
  align?: "left" | "right";
}) {
  return (
    <div
      className={`flex gap-2 ${
        align === "right" ? "justify-end" : "justify-start"
      } animate-pulse`}
    >
      {/* Avatar */}
      <div className="w-8 h-8 rounded-full bg-muted" />

      {/* Bubble */}
      <div className="max-w-xs">
        <div className="h-10 w-40 rounded-lg bg-muted mb-1" />
        <div className="h-2 w-10 bg-muted rounded ml-auto" />
      </div>
    </div>
  );
}
