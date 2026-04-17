"use client";
import { SOCKET_EVENTS } from "@/constants/socket";
import { useChatroom } from "@/provider/chatroom.provider";
import { useSocket } from "@/provider/socket.provider";
import { useUserStore } from "@/store/user.store";
import React, { useCallback, useState } from "react";
import { generateCuid } from "@/utils";
import { ADD_MESSAGE_SOCKET_PAYLOAD } from "@/types/socket";
export default function ChatInput() {
  const { socket } = useSocket();
  const { data: user } = useUserStore();
  const { chatroom } = useChatroom();
  const [text, setText] = useState("");
  const typingRef = React.useRef(false);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setText(value);

    if (!socket || !chatroom || !user) return;

    if (!typingRef.current) {
      typingRef.current = true;

      socket.emit(SOCKET_EVENTS.COMMON.TYPING, {
        chatroomId: chatroom.chatroomId,
        userId: user.userId,
      });
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      typingRef.current = false;

      socket.emit(SOCKET_EVENTS.COMMON.STOP_TYPING, {
        chatroomId: chatroom.chatroomId,
        userId: user.userId,
      });
    }, 1500);
  };

  const handleSubmit = useCallback(async () => {
    if (!socket || !chatroom || !user || !text.trim()) return;

    socket.emit(SOCKET_EVENTS.COMMON.STOP_TYPING, {
      chatroomId: chatroom.chatroomId,
      userId: user.userId,
    });

    typingRef.current = false;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    const payload: ADD_MESSAGE_SOCKET_PAYLOAD = {
      message: {
        publicId: generateCuid("message"),
        type: "GENERAL",
        attachments: [],
        text,
      },
      createdAt: new Date(),
      chatroomId: chatroom.chatroomId,
      by: user.userId,
    };

    socket.emit(SOCKET_EVENTS.MESSAGE.ADD, payload);
    setText("");
  }, [socket, chatroom, user, text]);
  return (
    <div className="p-3 border-t flex items-center gap-2">
      <input
        value={text}
        onChange={handleChange}
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
