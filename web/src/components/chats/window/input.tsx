"use client";
import { ADD_MESSAGE_SOCKET_PAYLOAD, SOCKET_EVENTS } from "@/constants/socket";
import { useChatroom } from "@/provider/chatroom.provider";
import { useSocket } from "@/provider/socket.provider";
import { useUserStore } from "@/store/user.store";
import React, { useCallback, useState } from "react";
import { generateCuid } from "@/utils";
export default function ChatInput() {
  const { socket } = useSocket();
  const { data: user } = useUserStore();
  const { chatroom } = useChatroom();
  const [text, setText] = useState("");
  const handleSubmit = useCallback(async () => {
    if (!socket || !chatroom || !user) return;
    const payload: ADD_MESSAGE_SOCKET_PAYLOAD = {
      message: {
        publicId: generateCuid("message"),
        type: "GENERAL",
        attachments: [],
        text,
      },
      chatroomId: chatroom.chatroomId,
      by: user.userId,
    };
    socket.emit(SOCKET_EVENTS.MESSAGE.ADD, payload);
  }, [socket, chatroom, user]);

  return (
    <div className="p-3 border-t flex items-center gap-2">
      <button className="p-2">😊</button>

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 border rounded-full px-4 py-2 text-sm outline-none"
      />

      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-full"
        onClick={() => {
          handleSubmit();
        }}
      >
        Send
      </button>
    </div>
  );
}
