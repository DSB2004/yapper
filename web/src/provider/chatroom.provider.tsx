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
  DETAILS_SOCKET_PAYLOAD,
  JOIN_SOCKET_PAYLOAD,
  LEAVECHAT_SOCKET_PAYLOAD,
} from "@/types/socket";
import { useUserStore } from "@/store/user.store";

type ONLINE_SOCKET_PAYLOAD = { userId: string };
type OFFLINE_SOCKET_PAYLOAD = { userId: string };

type ChatroomContextType = {
  chatroom: Chatroom | null;
  join: (chatroom: Chatroom) => Promise<void>;
  inChat: Map<string, string[]>;
  online: Set<string>;
  typing: Map<string, string[]>;
};

const ChatroomContext = createContext<ChatroomContextType | undefined>(
  undefined,
);

export const ChatroomProvider = ({ children }: { children: ReactNode }) => {
  const [chatroom, setChatroom] = useState<Chatroom | null>(null);
  const { socket } = useSocket();
  const { data: user } = useUserStore();
  const [typing, setTyping] = useState<Map<string, string[]>>(new Map());
  const [inChat, setInChat] = useState<Map<string, string[]>>(new Map());
  const [online, setOnline] = useState<Set<string>>(new Set());

  const initializedRef = useRef(false);

  const handleJoin = useCallback((payload: JOIN_SOCKET_PAYLOAD) => {
    console.log("join called", payload);
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
      if (!initializedRef.current) return;

      setTyping((prev) => {
        const updated = new Map(prev);
        const users = updated.get(payload.chatroomId) || [];

        if (!users.includes(payload.userId)) {
          updated.set(payload.chatroomId, [...users, payload.userId]);
        }

        return updated;
      });
    },
    [],
  );

  const handleStopTyping = useCallback(
    (payload: { chatroomId: string; userId: string }) => {
      if (!initializedRef.current) return;

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
    [],
  );

  const handleLeave = useCallback((payload: LEAVECHAT_SOCKET_PAYLOAD) => {
    console.log("leave called", payload);
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
    console.log("details called", payload);
    setInChat(new Map(Object.entries(payload.inChat)));
    setOnline(new Set(payload.onlineUsers));

    initializedRef.current = true;
  }, []);

  const handleOnline = useCallback((payload: ONLINE_SOCKET_PAYLOAD) => {
    console.log("online called", payload);
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

  useEffect(() => {
    if (!socket) return;
    console.log("socket initialized");
    socket.on(SOCKET_EVENTS.COMMON.JOIN_CLIENT, handleJoin);
    socket.on(SOCKET_EVENTS.COMMON.LEAVE_CLIENT, handleLeave);
    socket.on(SOCKET_EVENTS.COMMON.DETAILS_CLIENT, handleDetails);
    socket.on(SOCKET_EVENTS.COMMON.ONLINE_CLIENT, handleOnline);
    socket.on(SOCKET_EVENTS.COMMON.OFFLINE_CLIENT, handleOffline);
    socket.on(SOCKET_EVENTS.COMMON.TYPING_CLIENT, handleTyping);
    socket.on(SOCKET_EVENTS.COMMON.STOP_TYPING_CLIENT, handleStopTyping);

    return () => {
      socket.off(SOCKET_EVENTS.COMMON.JOIN_CLIENT, handleJoin);
      socket.off(SOCKET_EVENTS.COMMON.LEAVE_CLIENT, handleLeave);
      socket.off(SOCKET_EVENTS.COMMON.DETAILS_CLIENT, handleDetails);
      socket.off(SOCKET_EVENTS.COMMON.ONLINE_CLIENT, handleOnline);
      socket.off(SOCKET_EVENTS.COMMON.OFFLINE_CLIENT, handleOffline);
      socket.off(SOCKET_EVENTS.COMMON.TYPING_CLIENT, handleTyping);
      socket.off(SOCKET_EVENTS.COMMON.STOP_TYPING_CLIENT, handleStopTyping);
    };
  }, [
    socket,
    handleJoin,
    handleLeave,
    handleDetails,
    handleOnline,
    handleOffline,
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
      value={{ join, chatroom, inChat, online, typing }}
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
