"use client";

import { Message, MessageType } from "@/types/message";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  SetStateAction,
  Dispatch,
  useEffect,
} from "react";
import { useChatroom } from "./chatroom.provider";
import { useSocket } from "./socket.provider";

import { SOCKET_EVENTS } from "@/constants/socket";
import {
  ADD_MESSAGE_SOCKET_PAYLOAD,
  UPDATE_MESSAGE_SOCKET_PAYLOAD,
  DELETE_MESSAGE_SOCKET_PAYLOAD,
  PINNED_MESSAGE_SOCKET_PAYLOAD,
  STARRED_MESSAGE_SOCKET_PAYLOAD,
  REACTION_MESSAGE_SOCKET_PAYLOAD,
  SEEN_MESSAGE_SOCKET_PAYLOAD,
  RECEIVED_MESSAGE_SOCKET_PAYLOAD,
} from "@/types/socket";

import { useQueryClient } from "@tanstack/react-query";

type MessageContextType = {
  unreadCount: Map<string, number>;
};

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const MessageProvider = ({ children }: { children: ReactNode }) => {
  const { chatroom } = useChatroom();
  const [unreadCount, setCount] = useState<Map<string, number>>(new Map());
  const { socket } = useSocket();
  const queryClient = useQueryClient();
  useEffect(() => {
    if (!socket) return;
    const handleAdd = (payload: ADD_MESSAGE_SOCKET_PAYLOAD) => {
      const { chatroomId, message, by, createdAt } = payload;
      queryClient.setQueryData<Message[]>(["message", chatroomId], (old) => {
        if (!old) return old;
        return [
          ...old,
          {
            publicId: message.publicId,
            type: message.type as unknown as MessageType,
            attachments: message.attachments,
            text: message.text ?? undefined,
            seen: [by],
            received: [by],
            isUpdated: false,
            isStarred: false,
            isPinned: false,
            chatroomId,
            createdAt: createdAt,
            updatedAt: createdAt,
            by,
          } as any,
        ];
      });
      if (chatroom?.chatroomId !== chatroomId) {
        setCount((prev) => {
          const newMap = new Map(prev);
          newMap.set(chatroomId, (newMap.get(chatroomId) || 0) + 1);
          return newMap;
        });
      }
    };

    const handleUpdate = (payload: UPDATE_MESSAGE_SOCKET_PAYLOAD) => {
      const { chatroomId, messageId, message } = payload;

      queryClient.setQueryData<Message[]>(["message", chatroomId], (old) => {
        if (!old) return old;

        return old.map((msg) =>
          msg.publicId === messageId
            ? { ...msg, text: message.text, isUpdated: true }
            : msg,
        );
      });
    };

    const handleDelete = (payload: DELETE_MESSAGE_SOCKET_PAYLOAD) => {
      const { chatroomId, messageId } = payload;

      queryClient.setQueryData<Message[]>(["message", chatroomId], (old) => {
        if (!old) return old;
        return old.filter((msg) => msg.publicId !== messageId);
      });
    };

    const handleReaction = (payload: REACTION_MESSAGE_SOCKET_PAYLOAD) => {
      const { chatroomId, messageId, reaction, reactionBy } = payload;

      queryClient.setQueryData<Message[]>(["message", chatroomId], (old) => {
        if (!old) return old;

        return old.map((msg) => {
          if (msg.publicId !== messageId) return msg;

          return {
            ...msg,
            reactions: [
              ...((msg as any).reactions || []),
              { reaction, by: reactionBy },
            ],
          };
        });
      });
    };

    const handleSeen = (payload: SEEN_MESSAGE_SOCKET_PAYLOAD) => {
      const { chatroomId, messageId, seenBy } = payload;

      queryClient.setQueryData<Message[]>(["message", chatroomId], (old) => {
        if (!old) return old;

        return old.map((msg) => {
          if (msg.publicId !== messageId) return msg;
          return {
            ...msg,
            seen: [...new Set([...(msg.seen || []), seenBy])],
          };
        });
      });
    };

    const handleReceived = (payload: RECEIVED_MESSAGE_SOCKET_PAYLOAD) => {
      const { chatroomId, messageId, receivedBy } = payload;

      queryClient.setQueryData<Message[]>(["message", chatroomId], (old) => {
        if (!old) return old;

        return old.map((msg) => {
          if (msg.publicId !== messageId) return msg;

          return {
            ...msg,
            received: [...new Set([...(msg.received || []), receivedBy])],
          };
        });
      });
    };

    const handlePin = (payload: PINNED_MESSAGE_SOCKET_PAYLOAD) => {
      const { chatroomId, messageId } = payload;

      queryClient.setQueryData<Message[]>(["message", chatroomId], (old) => {
        if (!old) return old;

        return old.map((msg) =>
          msg.publicId === messageId
            ? { ...msg, isPinned: !msg.isPinned }
            : msg,
        );
      });
    };

    const handleStar = (payload: STARRED_MESSAGE_SOCKET_PAYLOAD) => {
      const { chatroomId, messageId } = payload;

      queryClient.setQueryData<Message[]>(["message", chatroomId], (old) => {
        if (!old) return old;

        return old.map((msg) =>
          msg.publicId === messageId
            ? { ...msg, isStarred: !msg.isStarred }
            : msg,
        );
      });
    };

    socket.on(SOCKET_EVENTS.MESSAGE.ADD_CLIENT, handleAdd);
    socket.on(SOCKET_EVENTS.MESSAGE.UPDATE_CLIENT, handleUpdate);
    socket.on(SOCKET_EVENTS.MESSAGE.DELETE_CLIENT, handleDelete);
    socket.on(SOCKET_EVENTS.MESSAGE.REACTION_CLIENT, handleReaction);
    socket.on(SOCKET_EVENTS.MESSAGE.SEEN_CLIENT, handleSeen);
    socket.on(SOCKET_EVENTS.MESSAGE.RECEIVED_CLIENT, handleReceived);
    socket.on(SOCKET_EVENTS.MESSAGE.PIN_CLIENT, handlePin);
    socket.on(SOCKET_EVENTS.MESSAGE.STAR_CLIENT, handleStar);

    return () => {
      socket.off(SOCKET_EVENTS.MESSAGE.ADD_CLIENT, handleAdd);
      socket.off(SOCKET_EVENTS.MESSAGE.UPDATE_CLIENT, handleUpdate);
      socket.off(SOCKET_EVENTS.MESSAGE.DELETE_CLIENT, handleDelete);
      socket.off(SOCKET_EVENTS.MESSAGE.REACTION_CLIENT, handleReaction);
      socket.off(SOCKET_EVENTS.MESSAGE.SEEN_CLIENT, handleSeen);
      socket.off(SOCKET_EVENTS.MESSAGE.RECEIVED_CLIENT, handleReceived);
      socket.off(SOCKET_EVENTS.MESSAGE.PIN_CLIENT, handlePin);
      socket.off(SOCKET_EVENTS.MESSAGE.STAR_CLIENT, handleStar);
    };
  }, [socket, chatroom]);

  return (
    <MessageContext.Provider
      value={{
        unreadCount,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

export const useMessage = () => {
  const context = useContext(MessageContext);
  if (!context)
    throw new Error("useSidebar must be used within a MessageProvider");
  return context;
};
