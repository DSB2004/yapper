"use client";

import React, { useEffect, useRef } from "react";
import { MessageCard } from "./card";
import { MessageSkeleton } from "./card/skeleton";
import { useMessageStore } from "@/store/message.store";
import Typing from "./ui";
import { MessageSquare } from "lucide-react";

export default function ChatArea() {
  const { data: messages, isLoading } = useMessageStore();

  const bottomRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-hidden relative flex flex-col">
      <div className="absolute top-0 left-0 h-full w-full flex flex-col py-4 overflow-y-auto no-scrollbar">
        {isLoading &&
          Array.from({ length: 6 }).map((_, i) => (
            <MessageSkeleton key={i} align={i % 2 === 0 ? "left" : "right"} />
          ))}

        {!isLoading && messages?.length === 0 && (
          <div className="flex flex-col items-center justify-center w-full h-full">
            <div className="text-center max-w-md px-6 space-y-4 text-muted-foreground">
              <div className="flex items-center justify-center">
                <MessageSquare className="size-10" />
              </div>

              <h2 className="text-xl font-medium">No messages yet</h2>

              <p>Be the first to start the conversation in this chat.</p>
            </div>
          </div>
        )}
        {!isLoading &&
          messages?.map((msg, idx) => (
            <MessageCard
              key={msg.publicId}
              msg={msg}
              next={messages[idx + 1] ?? null}
            />
          ))}

        <Typing />

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
