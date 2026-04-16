"use client";
import React, { useState } from "react";
import { MessageCard, MessageSkeleton } from "./card";
import { useMessageStore } from "@/store/message.store";

export default function ChatArea() {
  const { data: messages, isFetching, isLoading } = useMessageStore();
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      {isLoading &&
        Array.from({ length: 6 }).map((_, i) => (
          <MessageSkeleton key={i} align={i % 2 === 0 ? "left" : "right"} />
        ))}

      {!isLoading &&
        messages?.map((msg, idx) => (
          <MessageCard
            key={msg.publicId}
            prev={idx === 0 ? null : messages[idx - 1]}
            msg={msg}
          />
        ))}
    </div>
  );
}
