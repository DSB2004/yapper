"use client";

import React, {
  createContext,
  useContext,
  useMemo,
  Suspense,
  useEffect,
} from "react";
import { useQuery } from "@tanstack/react-query";

import { useSearchParams } from "next/navigation";
import { getUser } from "@/app/actions/user/get.action";
import { toast } from "sonner";
import { getChatrooms } from "@/app/actions/chatroom/get.action";
import { Chatroom } from "@/types/chatroom";
import { useChatroom } from "@/provider/chatroom.provider";
import { useSocket } from "@/provider/socket.provider";
import { getMessages } from "@/app/actions/messages/get.action";
import { Message } from "@/types/message";

interface MessageStoreInterface {
  isFetching: boolean;
  isError: boolean;
  isLoading: boolean;
  data: Message[] | undefined;
  refetch: Function;
  error: Error | null;
}

const MessageStoreContext = createContext<MessageStoreInterface | null>(null);

function MessageStoreContent({ children }: { children: React.ReactNode }) {
  const { chatroom } = useChatroom();

  const { isFetching, isError, isLoading, data, error, refetch } = useQuery<
    Message[] | undefined
  >({
    queryKey: ["message", chatroom?.chatroomId],
    queryFn: async () => {
      if (!chatroom) return [];
      const res = await getMessages({ chatroomId: chatroom?.chatroomId });
      console.log(res);
      if (!res.success) {
        toast.error(res.message);
      }
      return res.messages;
    },
    enabled: !!chatroom,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return (
    <MessageStoreContext.Provider
      value={{
        isLoading,
        isError,
        isFetching,
        data,
        error,
        refetch,
      }}
    >
      {children}
    </MessageStoreContext.Provider>
  );
}

export const MessageStore = ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense fallback={<></>}>
      <MessageStoreContent>{children}</MessageStoreContent>
    </Suspense>
  );
};

export const useMessageStore = () => {
  const ctx = useContext(MessageStoreContext);
  if (!ctx) throw new Error("useMessageStore must be used inside MessageStore");
  return ctx;
};
