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
} from "react";
import { useSocket } from "./socket.provider";
import { SOCKET_EVENTS } from "@/constants/socket";
import {
  BLOCK_STATUS_PAYLOAD,
  DETAILS_SOCKET_PAYLOAD,
  JOIN_SOCKET_PAYLOAD,
  LEAVECHAT_SOCKET_PAYLOAD,
} from "@/types/socket";
import { useUserStore } from "@/store/user.store";
import { Message } from "@/types/message";
import { useQueryClient } from "@tanstack/react-query";
import { blockContact } from "@/app/actions/contacts/block.action";

type ONLINE_SOCKET_PAYLOAD = { userId: string };
type OFFLINE_SOCKET_PAYLOAD = { userId: string };

type ChatroomContextType = {
  chatroom: Chatroom | null;
  join: (chatroom: Chatroom) => Promise<void>;
  inChat: Map<string, string[]>;
  online: Set<string>;
  typing: Map<string, string[]>;
  newChatrooms: Chatroom[];
  blockUser: () => Promise<void>;
};

const ChatroomContext = createContext<ChatroomContextType | undefined>(
  undefined,
);

export const ChatroomProvider = ({ children }: { children: ReactNode }) => {
  const [chatroom, setChatroom] = useState<Chatroom | null>(null);
  const { socket } = useSocket();
  const { data: user } = useUserStore();
  const [newChatrooms, setNewChatroom] = useState<Chatroom[]>([]);
  const [typing, setTyping] = useState<Map<string, string[]>>(new Map());
  const [inChat, setInChat] = useState<Map<string, string[]>>(new Map());
  const [online, setOnline] = useState<Set<string>>(new Set());
  const initializedRef = useRef(false);
  const [pinned, setPinned] = useState<Message[]>([]);

  const handleNewChat = useCallback((payload: { chatroom: Chatroom }) => {
    setNewChatroom((prev) => [...prev, payload.chatroom]);
  }, []);

  const handleJoin = useCallback((payload: JOIN_SOCKET_PAYLOAD) => {
    if (!initializedRef.current) return;

    setInChat((prev) => {
      const updated = new Map(prev);
      const users = updated.get(payload.chatroomId) || [];

      if (!users.includes(payload.userId)) {
        updated.set(payload.chatroomId, [...users, payload.userId]);
      }

      return updated;
    });
  }, []);

  const handleTyping = useCallback(
    (payload: { chatroomId: string; userId: string }) => {
      if (!initializedRef.current || payload.userId === user?.userId) return;

      setTyping((prev) => {
        const updated = new Map(prev);
        const users = updated.get(payload.chatroomId) || [];

        if (!users.includes(payload.userId)) {
          updated.set(payload.chatroomId, [...users, payload.userId]);
        }

        return updated;
      });
    },
    [user],
  );

  const handleStopTyping = useCallback(
    (payload: { chatroomId: string; userId: string }) => {
      if (!initializedRef.current || payload.userId === user?.userId) return;

      setTyping((prev) => {
        const updated = new Map(prev);
        const users = updated.get(payload.chatroomId) || [];

        const filtered = users.filter((id) => id !== payload.userId);

        if (filtered.length > 0) {
          updated.set(payload.chatroomId, filtered);
        } else {
          updated.delete(payload.chatroomId);
        }

        return updated;
      });
    },
    [user],
  );

  const handleLeave = useCallback((payload: LEAVECHAT_SOCKET_PAYLOAD) => {
    if (!initializedRef.current) return;

    setInChat((prev) => {
      const updated = new Map(prev);
      const users = updated.get(payload.chatroomId) || [];

      const filtered = users.filter((id) => id !== payload.userId);

      if (filtered.length > 0) {
        updated.set(payload.chatroomId, filtered);
      } else {
        updated.delete(payload.chatroomId);
      }

      return updated;
    });
  }, []);

  const handleDetails = useCallback((payload: DETAILS_SOCKET_PAYLOAD) => {
    setInChat(new Map(Object.entries(payload.inChat)));
    setOnline(new Set(payload.onlineUsers));

    initializedRef.current = true;
  }, []);

  const handleOnline = useCallback((payload: ONLINE_SOCKET_PAYLOAD) => {
    if (!initializedRef.current) return;

    setOnline((prev) => {
      const updated = new Set(prev);
      updated.add(payload.userId);
      return updated;
    });
  }, []);

  const handleOffline = useCallback((payload: OFFLINE_SOCKET_PAYLOAD) => {
    if (!initializedRef.current) return;

    const { userId } = payload;

    setOnline((prev) => {
      const updated = new Set(prev);
      updated.delete(userId);
      return updated;
    });

    setInChat((prev) => {
      const updated = new Map(prev);

      for (const [roomId, users] of updated.entries()) {
        const filtered = users.filter((id) => id !== userId);

        if (filtered.length > 0) {
          updated.set(roomId, filtered);
        } else {
          updated.delete(roomId);
        }
      }

      return updated;
    });

    setTyping((prev) => {
      const updated = new Map(prev);

      for (const [roomId, users] of updated.entries()) {
        const filtered = users.filter((id) => id !== userId);

        if (filtered.length > 0) {
          updated.set(roomId, filtered);
        } else {
          updated.delete(roomId);
        }
      }

      return updated;
    });
  }, []);
  const queryClient = useQueryClient();
  const handleBlock = useCallback(
    ({ chatroomId, contactId, userId }: BLOCK_STATUS_PAYLOAD) => {
      if (!initializedRef.current) return;
      if (contactId !== user?.userId) return;
      queryClient.setQueryData<Chatroom[]>(["chatrooms"], (old) => {
        if (!old) {
          return old;
        }
        let chatroomToUpdate = old.find((ele) => ele.chatroomId === chatroomId);
        if (!chatroomToUpdate) {
          chatroomToUpdate = newChatrooms.find(
            (ele) => ele.chatroomId === chatroomId,
          );
        }
        if (!chatroomToUpdate) {
          return old;
        }

        return [
          {
            ...chatroomToUpdate,
            areYouBlocked: true,
          } as Chatroom,

          ...old.filter((c) => c.chatroomId !== chatroomId),
        ];
      });
      if (chatroom?.chatroomId === chatroomId) {
        setChatroom((prev) => {
          if (!prev) return null;
          return { ...prev, areYouBlocked: true };
        });
      }
    },
    [queryClient, user, chatroom],
  );

  const handleUnBlock = useCallback(
    ({ chatroomId, contactId, userId }: BLOCK_STATUS_PAYLOAD) => {
      if (!initializedRef.current) return;
      if (contactId !== user?.userId) return;
      queryClient.setQueryData<Chatroom[]>(["chatrooms"], (old) => {
        if (!old) {
          return old;
        }
        let chatroomToUpdate = old.find((ele) => ele.chatroomId === chatroomId);
        if (!chatroomToUpdate) {
          chatroomToUpdate = newChatrooms.find(
            (ele) => ele.chatroomId === chatroomId,
          );
        }

        if (!chatroomToUpdate) {
          return old;
        }

        return [
          {
            ...chatroomToUpdate,
            areYouBlocked: false,
          } as Chatroom,

          ...old.filter((c) => c.chatroomId !== chatroomId),
        ];
      });
      if (chatroom?.chatroomId === chatroomId) {
        setChatroom((prev) => {
          if (!prev) return null;
          return { ...prev, areYouBlocked: false };
        });
      }
    },
    [queryClient, user, chatroom],
  );

  const blockUser = useCallback(async () => {
    if (!user || !chatroom) return;
    const other = chatroom?.participants.filter(
      (ele) => ele.userId !== user?.userId,
    )[0];
    if (!other) {
      console.warn("No other participant in this chatroom");
      return;
    }
    await blockContact({ contactUserId: other.userId });
    queryClient.setQueryData<Chatroom[]>(["chatrooms"], (old) => {
      if (!old) {
        return old;
      }
      let chatroomToUpdate = old.find(
        (ele) => ele.chatroomId === chatroom.chatroomId,
      );
      if (!chatroomToUpdate) {
        chatroomToUpdate = newChatrooms.find(
          (ele) => ele.chatroomId === chatroom.chatroomId,
        );
      }
      if (!chatroomToUpdate) {
        return old;
      }

      return [
        {
          ...chatroomToUpdate,
          isBlocked: !chatroom.isBlocked,
        } as Chatroom,

        ...old.filter((c) => c.chatroomId !== chatroom.chatroomId),
      ];
    });

    setChatroom((prev) => {
      if (!prev) return null;
      return { ...prev, isBlocked: !chatroom.isBlocked };
    });
  }, [queryClient, user, chatroom]);

  useEffect(() => {
    if (!socket) return;
    socket.on(SOCKET_EVENTS.COMMON.JOIN_CLIENT, handleJoin);
    socket.on(SOCKET_EVENTS.COMMON.LEAVE_CLIENT, handleLeave);
    socket.on(SOCKET_EVENTS.COMMON.DETAILS_CLIENT, handleDetails);
    socket.on(SOCKET_EVENTS.COMMON.ONLINE_CLIENT, handleOnline);
    socket.on(SOCKET_EVENTS.COMMON.OFFLINE_CLIENT, handleOffline);
    socket.on(SOCKET_EVENTS.COMMON.TYPING_CLIENT, handleTyping);
    socket.on(SOCKET_EVENTS.COMMON.STOP_TYPING_CLIENT, handleStopTyping);
    socket.on(SOCKET_EVENTS.COMMON.NEW_CHATROOM_CLIENT, handleNewChat);
    socket.on(SOCKET_EVENTS.CONTACT.BLOCK_CLIENT, handleBlock);
    socket.on(SOCKET_EVENTS.CONTACT.UNBLOCK_CLIENT, handleUnBlock);
    return () => {
      socket.off(SOCKET_EVENTS.COMMON.JOIN_CLIENT, handleJoin);
      socket.off(SOCKET_EVENTS.COMMON.LEAVE_CLIENT, handleLeave);
      socket.off(SOCKET_EVENTS.COMMON.DETAILS_CLIENT, handleDetails);
      socket.off(SOCKET_EVENTS.COMMON.ONLINE_CLIENT, handleOnline);
      socket.off(SOCKET_EVENTS.COMMON.OFFLINE_CLIENT, handleOffline);
      socket.off(SOCKET_EVENTS.COMMON.TYPING_CLIENT, handleTyping);
      socket.off(SOCKET_EVENTS.COMMON.STOP_TYPING_CLIENT, handleStopTyping);
      socket.off(SOCKET_EVENTS.COMMON.NEW_CHATROOM_CLIENT, handleNewChat);
      socket.off(SOCKET_EVENTS.CONTACT.BLOCK_CLIENT, handleBlock);
      socket.off(SOCKET_EVENTS.CONTACT.UNBLOCK_CLIENT, handleUnBlock);
    };
  }, [
    socket,
    handleJoin,
    handleLeave,
    handleDetails,
    handleOnline,
    handleOffline,
    handleNewChat,
    handleBlock,
    handleUnBlock,
  ]);

  const join = useCallback(
    async (newChatroom: Chatroom) => {
      if (!socket || !user) return;

      if (chatroom) {
        socket.emit(SOCKET_EVENTS.COMMON.LEAVE, {
          userId: user.userId,
          chatroomId: chatroom.chatroomId,
        });
      }

      setChatroom(newChatroom);

      socket.emit(SOCKET_EVENTS.COMMON.JOIN, {
        userId: user.userId,
        chatroomId: newChatroom.chatroomId,
      });
    },
    [chatroom, socket, user],
  );

  return (
    <ChatroomContext.Provider
      value={{
        join,
        blockUser,
        newChatrooms,
        chatroom,
        inChat,
        online,
        typing,
      }}
    >
      {children}
    </ChatroomContext.Provider>
  );
};

export const useChatroom = () => {
  const context = useContext(ChatroomContext);
  if (!context) {
    throw new Error("useChatroom must be used within a ChatroomProvider");
  }
  return context;
};
