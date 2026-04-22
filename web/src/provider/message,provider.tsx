"use client";

import { Message, MessageAttachment, MessageType } from "@/types/message";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  SetStateAction,
  Dispatch,
  useEffect,
  useRef,
  useCallback,
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
  MessagePayload,
} from "@/types/socket";

import { useQueryClient } from "@tanstack/react-query";
import { useUserStore } from "@/store/user.store";
import { Chatroom } from "@/types/chatroom";
import { useChatroomStore } from "@/store/chatroom.store";

type MessageContextType = {
  unreadCount: Map<string, number>;
};

const MessageContext = createContext<MessageContextType | undefined>(undefined);
function generatePreviewText({
  text,
  isDeleted,
  attachments,
}: {
  text: string;
  attachments: MessageAttachment[];
  isDeleted?: boolean;
}) {
  if (isDeleted) {
    return "This message has been deleted";
  }
  if (text) return text;

  if (attachments.length) {
    const file = attachments[0]?.filename || "";

    if (/\.(jpg|jpeg|png|webp)$/i.test(file)) return "Photo";
    if (/\.(mp4|mov|avi)$/i.test(file)) return "Video";

    return `${attachments.length} file(s)`;
  }

  return "";
}
export const MessageProvider = ({ children }: { children: ReactNode }) => {
  const { chatroom, newChatrooms } = useChatroom();
  const { refetch, data: chatrooms } = useChatroomStore();
  const [unreadCount, setCount] = useState<Map<string, number>>(new Map());
  const { socket } = useSocket();
  const { data: user } = useUserStore();
  const queryClient = useQueryClient();
  const initRef = useRef<boolean>(false);
  useEffect(() => {
    if (!chatroom) return;
    setCount((prev) => {
      const newMap = new Map(prev);
      newMap.delete(chatroom.chatroomId);
      return newMap;
    });
  }, [chatroom]);
  useEffect(() => {
    if (!chatrooms || initRef.current) return;
    initRef.current = true;
    const newCountMap = new Map();
    chatrooms.map((ele) => {
      if (ele.unreadCount) {
        newCountMap.set(ele.chatroomId, ele.unreadCount);
      }
    });
    setCount(newCountMap);
  }, [chatrooms]);
  const handleAdd = useCallback(
    (payload: ADD_MESSAGE_SOCKET_PAYLOAD) => {
      if (!socket || !user) return;
      console.log("add", payload);
      const { chatroomId, message, by, createdAt } = payload;
      
      if (!message.for.includes(user.userId)) return;
      queryClient.setQueryData<Message[]>(["message", chatroomId], (old) => {
        if (!old) return old;
        return [
          ...old,
          {
            publicId: message.publicId,
            type: message.type as unknown as MessageType,
            attachments: message.attachments,
            text: message.text ?? undefined,
            for: message.for,
            seen: [by],
            received: [by],
            isUpdated: false,
            isStarred: false,
            isPinned: false,
            isForwarded: message.isForwarded,
            isReply: message.isReply,
            replyFor: message.replyFor,
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
      if (!user) return;
      socket.emit(SOCKET_EVENTS.MESSAGE.RECEIVED, {
        chatroomId,
        messageId: message.publicId,
        receivedBy: user.userId,
      } as RECEIVED_MESSAGE_SOCKET_PAYLOAD);

      queryClient.setQueryData<Chatroom[]>(["chatrooms"], (old) => {
        if (!old) {
          console.log("old not found");
          return old;
        }
        let chatroomToUpdate = old.find((ele) => ele.chatroomId === chatroomId);
        if (!chatroomToUpdate) {
          chatroomToUpdate = newChatrooms.find(
            (ele) => ele.chatroomId === chatroomId,
          );
        }
        if (!chatroomToUpdate) {
          initRef.current = false;
          refetch(); // incase user gets a new contact message
          return old;
        }

        return [
          {
            ...chatroomToUpdate,
            lastMessage: {
              publicId: message.publicId,
              text: message.text,
              by,
              previewText: generatePreviewText(message),
              createdAt: createdAt as unknown as string,
            },
          } as Chatroom,

          ...old.filter((c) => c.chatroomId !== chatroomId),
        ];
      });
    },
    [
      queryClient,
      socket,
      user,
      refetch,
      newChatrooms,
      chatroom,
      setCount,
      refetch,
    ],
  );
  const handleUpdate = useCallback(
    (payload: UPDATE_MESSAGE_SOCKET_PAYLOAD) => {
      const { chatroomId, messageId, message } = payload;

      queryClient.setQueryData<Message[]>(["message", chatroomId], (old) => {
        if (!old) return old;

        return old.map((msg) =>
          msg.publicId === messageId
            ? { ...msg, text: message.text, isUpdated: true }
            : msg,
        );
      });
      queryClient.setQueryData<Chatroom[]>(["chatrooms"], (old) => {
        if (!old) return old;
        let chatroomToUpdate = old.find((ele) => ele.chatroomId === chatroomId);
        if (!chatroomToUpdate) {
          chatroomToUpdate = newChatrooms.find(
            (ele) => ele.chatroomId === chatroomId,
          );
        }
        if (!chatroomToUpdate) {
          initRef.current = false;
          refetch(); // incase user gets a new contact message
          return old;
        }

        if (
          chatroomToUpdate.lastMessage &&
          chatroomToUpdate.lastMessage.publicId !== messageId
        )
          return old;
        return [
          {
            ...chatroomToUpdate,
            lastMessage: {
              publicId: messageId,
              text: message.text,
              by: chatroomToUpdate.lastMessage?.by,
              createdAt: chatroomToUpdate.lastMessage?.createdAt,
              previewText: generatePreviewText({
                text: message.text,
                attachments: [],
              }),
            },
          } as Chatroom,
          ...old.filter((c) => c.chatroomId !== chatroomId),
        ];
      });
    },
    [
      queryClient,
      socket,
      user,
      refetch,
      newChatrooms,
      chatroom,
      setCount,
      refetch,
    ],
  );

  const handleDelete = useCallback(
    (payload: DELETE_MESSAGE_SOCKET_PAYLOAD) => {
      const { chatroomId, messageId } = payload;
      queryClient.setQueryData<Message[]>(["message", chatroomId], (old) => {
        if (!old) return old;

        return old.map((msg) =>
          msg.publicId === messageId
            ? { ...msg, text: "", attachments: [], isDeleted: true }
            : msg,
        );
      });

      queryClient.setQueryData<Chatroom[]>(["chatrooms"], (old) => {
        if (!old) return old;
        let chatroomToUpdate = old.find((ele) => ele.chatroomId === chatroomId);
        if (!chatroomToUpdate) {
          chatroomToUpdate = newChatrooms.find(
            (ele) => ele.chatroomId === chatroomId,
          );
        }
        if (!chatroomToUpdate) {
          initRef.current = false;
          refetch(); // incase user gets a new contact message
          return old;
        }

        if (
          chatroomToUpdate.lastMessage &&
          chatroomToUpdate.lastMessage.publicId !== messageId
        )
          return old;
        return [
          {
            ...chatroomToUpdate,
            lastMessage: {
              publicId: messageId,
              text: "",
              by: chatroomToUpdate.lastMessage?.by,
              previewText: generatePreviewText({
                text: "",
                attachments: [],
                isDeleted: true,
              }),
              createdAt: chatroomToUpdate.lastMessage?.createdAt,
            },
          } as Chatroom,
          ...old.filter((c) => c.chatroomId !== chatroomId),
        ];
      });
    },
    [
      queryClient,
      socket,
      user,
      refetch,
      newChatrooms,
      chatroom,
      setCount,
      refetch,
    ],
  );
  const handleReaction = useCallback(
    (payload: REACTION_MESSAGE_SOCKET_PAYLOAD) => {
      const { chatroomId, messageId, reaction, reactionBy } = payload;

      queryClient.setQueryData<Message[]>(["message", chatroomId], (old) => {
        if (!old) return old;

        return old.map((msg) => {
          if (msg.publicId !== messageId) return msg;

          const existing = (msg.reactions ?? []).find(
            (r: any) => r.userId === reactionBy || r.by === reactionBy,
          );

          let updatedReactions = msg.reactions ?? [];

          if (!reaction) {
            updatedReactions = updatedReactions.filter(
              (r: any) => (r.userId ?? r.by) !== reactionBy,
            );
          } else if (existing) {
            updatedReactions = updatedReactions.map((r: any) =>
              (r.userId ?? r.by) === reactionBy ? { ...r, reaction } : r,
            );
          } else {
            updatedReactions = [
              ...updatedReactions,
              { reaction, userId: reactionBy },
            ];
          }

          return {
            ...msg,
            reactions: updatedReactions,
          };
        });
      });
    },
    [
      queryClient,
      socket,
      user,
      refetch,
      newChatrooms,
      chatroom,
      setCount,
      refetch,
    ],
  );
  const handleSeen = useCallback(
    (payload: SEEN_MESSAGE_SOCKET_PAYLOAD) => {
      const { chatroomId, messageId, seenBy } = payload;
      console.log("seen");
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
    },
    [
      queryClient,
      socket,
      user,
      refetch,
      newChatrooms,
      chatroom,
      setCount,
      refetch,
    ],
  );

  const handleReceived = useCallback(
    (payload: RECEIVED_MESSAGE_SOCKET_PAYLOAD) => {
      const { chatroomId, messageId, receivedBy } = payload;
      console.log("received");
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
    },
    [
      queryClient,
      socket,
      user,
      refetch,
      newChatrooms,
      chatroom,
      setCount,
      refetch,
    ],
  );

  const handlePin = useCallback(
    (payload: PINNED_MESSAGE_SOCKET_PAYLOAD) => {
      const { chatroomId, messageId } = payload;

      queryClient.setQueryData<Message[]>(["message", chatroomId], (old) => {
        if (!old) return old;

        return old.map((msg) =>
          msg.publicId === messageId
            ? { ...msg, isPinned: !msg.isPinned }
            : msg,
        );
      });
    },
    [
      queryClient,
      socket,
      user,
      refetch,
      newChatrooms,
      chatroom,
      setCount,
      refetch,
    ],
  );

  const handleStar = useCallback(
    (payload: STARRED_MESSAGE_SOCKET_PAYLOAD) => {
      const { chatroomId, messageId } = payload;

      queryClient.setQueryData<Message[]>(["message", chatroomId], (old) => {
        if (!old) return old;

        return old.map((msg) =>
          msg.publicId === messageId
            ? { ...msg, isStarred: !msg.isStarred }
            : msg,
        );
      });
    },
    [
      queryClient,
      socket,
      user,
      refetch,
      newChatrooms,
      chatroom,
      setCount,
      refetch,
    ],
  );
  useEffect(() => {
    if (!socket) return;

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
  }, [
    socket,
    handleAdd,
    handleUpdate,
    handleDelete,
    handlePin,
    handleReaction,
    handleReceived,
    handleSeen,
    handleStar,
  ]);

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
