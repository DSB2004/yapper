"use client";

import { Chatroom } from "@/types/chatroom";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  Dispatch,
  SetStateAction,
} from "react";
import { useChatroom } from "@/provider/chatroom.provider";
import { useMessageStore } from "@/store/message.store";
import { Message } from "@/types/message";

type WindowContextType = {
  pinned: Message[];
  replyTo: {
    chatroomId: string;
    messageId: string;
  } | null;

  setReplyTo: Dispatch<
    SetStateAction<{
      chatroomId: string;
      messageId: string;
    } | null>
  >;
};

const WindowContext = createContext<WindowContextType | undefined>(undefined);

export const WindowProvider = ({ children }: { children: ReactNode }) => {
  const [pinned, setPinned] = useState<Message[]>([]);
  const { data: messages } = useMessageStore();
  const { chatroom } = useChatroom();
  const [replyTo, setReply] = useState<{
    chatroomId: string;
    messageId: string;
  } | null>(null);

  useEffect(() => {
    if (
      !chatroom ||
      !messages ||
      (messages[0] && messages[0].chatroomId === chatroom.chatroomId)
    )
      setPinned([]);
    else setPinned(messages.filter((ele) => ele.isPinned));
  }, [messages, chatroom]);

  return (
    <WindowContext.Provider value={{ setReplyTo: setReply, replyTo, pinned }}>
      {children}
    </WindowContext.Provider>
  );
};

export const useWindow = () => {
  const context = useContext(WindowContext);
  if (!context) {
    throw new Error("useWindow must be used within a WindowProvider");
  }
  return context;
};
