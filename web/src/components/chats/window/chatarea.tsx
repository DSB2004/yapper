"use client";
import React, { useState } from "react";
import { MessageCard } from "./card";
import { MessageSkeleton } from "./card/skeleton";
import { useMessageStore } from "@/store/message.store";

export default function ChatArea() {
  const { data: messages, isFetching, isLoading } = useMessageStore();
  return (
    <div className="flex-1 overflow-hidden relative  flex flex-col">
      <div className="absolute top-0 left-0 h-full w-full flex flex-col  p-4  gap-2 overflow-y-auto no-scrollbar">
        {isLoading &&
          Array.from({ length: 6 }).map((_, i) => (
            <MessageSkeleton key={i} align={i % 2 === 0 ? "left" : "right"} />
          ))}

        {!isLoading &&
          messages?.map((msg, idx) => (
            <MessageCard
              key={msg.publicId}
              next={idx === messages.length ? null : messages[idx + 1]}
              msg={msg}
            />
          ))}
      </div>
    </div>
  );
}
