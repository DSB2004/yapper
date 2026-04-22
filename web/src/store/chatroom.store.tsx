"use client";

import React, { createContext, useContext, useMemo, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";

import { useSearchParams } from "next/navigation";
import { getUser } from "@/app/actions/user/get.action";
import { toast } from "sonner";
import { getChatrooms } from "@/app/actions/chatroom/get.action";
import { Chatroom } from "@/types/chatroom";

interface ChatroomStoreInterface {
  isFetching: boolean;
  isError: boolean;
  isLoading: boolean;
  data: Chatroom[] | undefined;
  refetch: Function;
  error: Error | null;
}

const ChatroomStoreContext = createContext<ChatroomStoreInterface | null>(null);

function ChatroomStoreContent({ children }: { children: React.ReactNode }) {
  const { isFetching, isError, isLoading, data, error, refetch } = useQuery<
    Chatroom[] | undefined
  >({
    queryKey: ["chatrooms"],
    queryFn: async () => {
      const res = await getChatrooms();
      if (!res.success) {
        toast.error(res.message);
      }
      return res.chats;
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return (
    <ChatroomStoreContext.Provider
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
    </ChatroomStoreContext.Provider>
  );
}

export const ChatroomStore = ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense fallback={<></>}>
      <ChatroomStoreContent>{children}</ChatroomStoreContent>
    </Suspense>
  );
};

export const useChatroomStore = () => {
  const ctx = useContext(ChatroomStoreContext);
  if (!ctx)
    throw new Error("useChatroomStore must be used inside ChatroomStore");
  return ctx;
};
