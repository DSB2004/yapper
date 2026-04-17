import { useChatroom } from "@/provider/chatroom.provider";
import { useSocket } from "@/provider/socket.provider";
import { useUserStore } from "@/store/user.store";
import { UserDetails } from "@/types/chatroom";
import { Message } from "@/types/message";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { SOCKET_EVENTS } from "@/constants/socket";
import {
  SEEN_MESSAGE_SOCKET_PAYLOAD,
  RECEIVED_MESSAGE_SOCKET_PAYLOAD,
} from "@/types/socket";
type MessageContextType = {
  user: UserDetails;
  msg: Message;
  you: boolean;
  showAvatar: boolean;
};

const MessageContext = createContext<MessageContextType | null>(null);

export default function MessageProviderWrapper({
  next,
  msg,
  children,
}: {
  next: Message | null;
  msg: Message;
  children: ReactNode;
}) {
  const { chatroom: room } = useChatroom();
  const { data: user } = useUserStore();
  const { socket } = useSocket();

  if (!room) return <></>;

  const userDetails: UserDetails = useMemo(() => {
    const sender = msg.by;

    const senderDetails = room.participants.find(
      (ele) => ele.userId === sender,
    );
    if (!senderDetails) return { name: "", avatar: "", userId: "" };
    return { ...senderDetails };
  }, [user, room, msg]);

  const you = useMemo(() => {
    if (msg && user) return msg.by === user.userId;
    return false;
  }, [user, msg]);

  const showAvatar = useMemo(() => {
    if (!next) return true;
    return msg.by !== next.by;
  }, [msg, next]);

  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!ref.current || !socket || !user || !msg) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!msg.seen?.includes(user.userId)) {
            const payload: SEEN_MESSAGE_SOCKET_PAYLOAD = {
              messageId: msg.publicId,
              seenBy: user.userId,
              chatroomId: room.chatroomId,
            };

            socket.emit(SOCKET_EVENTS.MESSAGE.SEEN, payload);
          }
        }
      },
      {
        threshold: 0.6, // 60% visible = seen
      },
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [msg, socket, user, room]);
  return (
    <MessageContext.Provider
      value={{ user: userDetails, you, msg, showAvatar }}
    >
      <div ref={ref}>{children}</div>
    </MessageContext.Provider>
  );
}

export const useMessageProvider = () => {
  const context = useContext(MessageContext);
  if (!context) throw Error("Can't use useMessage outside MessageProvider");
  return context;
};
