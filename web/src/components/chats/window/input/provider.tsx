"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
  useCallback,
  useRef,
  RefObject,
  ChangeEvent,
} from "react";
import { SOCKET_EVENTS } from "@/constants/socket";

import { generateCuid } from "@/utils";
import { ADD_MESSAGE_SOCKET_PAYLOAD } from "@/types/socket";
import { useSocket } from "@/provider/socket.provider";
import { useUserStore } from "@/store/user.store";
import { useChatroom } from "@/provider/chatroom.provider";
import { useWindow } from "../provider";
import { MessageAttachment } from "@/types/message";

type InputContextType = {
  handleChange: (e: ChangeEvent<HTMLInputElement, Element>) => void;
  handleSubmit: () => Promise<void>;
  text: string;
  setText: Dispatch<SetStateAction<string>>;
  attachments: MessageAttachment[];
  setAttachments: Dispatch<SetStateAction<MessageAttachment[]>>;
};

const InputContext = createContext<InputContextType | undefined>(undefined);

export const InputProvider = ({ children }: { children: ReactNode }) => {
  const { socket } = useSocket();
  const { data: user } = useUserStore();
  const { chatroom } = useChatroom();
  const [text, setText] = useState("");
  const [attachments, setAttachments] = useState<MessageAttachment[]>([]);
  const typingRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { replyTo, setReplyTo } = useWindow();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setText(value);
    if (!socket || !chatroom || !user || value.trim() === "") return;

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
    }, 1000);
  };

  const handleSubmit = useCallback(async () => {
    if (!socket || !chatroom || !user) return;

    if (!text.trim() && !attachments.length) return;

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
        attachments,
        text,
        for: chatroom.participants.map((ele) => ele.userId),
        isReply: replyTo ? true : false,
        replyFor: replyTo?.messageId ?? undefined,
        isForwarded: false,
      },
      createdAt: new Date(),
      chatroomId: chatroom.chatroomId,
      by: user.userId,
    };

    socket.emit(SOCKET_EVENTS.MESSAGE.ADD, payload);
    setText("");
    setAttachments([]);
    setReplyTo(null);
  }, [socket, chatroom, user, text, attachments, replyTo]);

  return (
    <InputContext.Provider
      value={{
        setText,
        text,
        attachments,
        setAttachments,
        handleChange,
        handleSubmit,
      }}
    >
      {children}
    </InputContext.Provider>
  );
};

export const useInput = () => {
  const context = useContext(InputContext);
  if (!context) {
    throw new Error("useInput must be used within a InputProvider");
  }
  return context;
};
