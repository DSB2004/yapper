"use client";
import React from "react";
import ChatHeader from "./header";
import ChatArea from "./chatarea";
import ChatInput from "./input";
import { useChatroom } from "@/provider/chatroom.provider";
import { MessageSquare } from "lucide-react";
import { WindowProvider } from "./provider";

export default function Window() {
  const { chatroom } = useChatroom();

  if (!chatroom) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full ">
        <div className="text-center max-w-md px-6 space-y-4 text-muted-foreground">
          {/* Icon */}
          <div className="flex items-center justify-center">
            <MessageSquare className="size-10"></MessageSquare>
          </div>

          <h2 className="text-xl">Select a chat to start messaging</h2>

          <p>
            Choose a conversation from the sidebar and start chatting instantly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <WindowProvider>
      <div className="flex flex-col w-full h-full relative">
        <ChatHeader />
        <ChatArea />
        <ChatInput />
      </div>
    </WindowProvider>
  );
}
