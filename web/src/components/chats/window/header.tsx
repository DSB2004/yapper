"use client";
import { Button } from "@/components/ui/button";
import { useChatroom } from "@/provider/chatroom.provider";
import { useUserStore } from "@/store/user.store";
import React, { useMemo, useState } from "react";

export default function ChatHeader() {
  // const [menuOpen, setMenuOpen] = useState(false);
  const { chatroom: room, online, inChat, typing, blockUser } = useChatroom();
  const { data: user } = useUserStore();
  if (!room) return <></>;

  const details = useMemo(() => {
    if (room.type === "GROUP")
      return {
        icon: room.icon,
        name: room.name,
        userId: null,
        type: room.type,
        online: false,
      };
    else {
      const other = room.participants.find(
        (ele) => ele.userId !== user?.userId,
      );
      if (room.areYouBlocked && other) {
        return {
          icon: "/placeholder.webp",
          name: "Yapper User",
          userId: other.userId as string,
          type: room.type,
          online: false,
        };
      }
      if (other)
        return {
          icon: other.avatar,
          name: other.name,
          userId: other.userId as string,
          type: room.type,
          online: online.has(other.userId),
        };
    }
    return {
      icon: room.icon as string,
      name: room.name as string,
      userId: null,
      type: room.type,
      online: false,
    };
  }, [user, room, online]);

  const label = useMemo(() => {
    if (!room) return "";

    const roomId = room.chatroomId;
    const usersInChat = inChat.get(roomId) || [];
    const typingUsers = typing.get(roomId) || [];

    const others = room.participants.filter((p) => p.userId !== user?.userId);

    const formatName = (p: (typeof others)[number]) =>
      p.userId === user?.userId ? "You" : p.name;

    // =========================
    // 🟢 PERSONAL CHAT
    // =========================
    if (room.type === "PERSONAL") {
      const other = others[0];

      if (!other) return "Offline";

      const isTyping = typingUsers.includes(other.userId);

      if (isTyping) return "Typing...";

      const isInChat = usersInChat.includes(other.userId);

      if (isInChat) {
        return `In Chat`;
      }

      if (online.has(other.userId)) {
        return "Online";
      }

      // if (room.lastMessage) return `Last seen ${room.lastMessage?.createdAt}`;
      return "Offline";
    }

    // =========================
    // 🟣 GROUP CHAT
    // =========================

    const typingGroup = others.filter((p) => typingUsers.includes(p.userId));

    if (typingGroup.length > 0) {
      const names = typingGroup.map(formatName);

      if (names.length === 1) {
        return `${names[0]} is typing...`;
      }

      if (names.length <= 3) {
        return `${names.join(", ")} are typing...`;
      }

      return `${names.slice(0, 3).join(", ")} and ${
        names.length - 3
      } others are typing...`;
    }

    const activeUsers = others.filter((p) => usersInChat.includes(p.userId));

    if (activeUsers.length > 0) {
      const names = activeUsers.map(formatName);

      if (names.length === 1) {
        return `${names[0]} is in chat`;
      }

      if (names.length <= 3) {
        return `${names.join(", ")} are in chat`;
      }

      return `${names.slice(0, 3).join(", ")} and ${
        names.length - 3
      } others are in chat`;
    }

    const names = room.participants.map(formatName);

    if (names.length <= 3) {
      return names.join(", ");
    }

    return `${names.slice(0, 3).join(", ")}...`;
  }, [room, online, inChat, typing, user]);

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b relative">
      <div className="flex items-center gap-3">
        <div className="relative">
          <img
            src={details.icon}
            className={` ${!room.isBlocked && details.online ? " border-primary  border-4" : `${details.type === "GROUP" ? "border-transparent" : "border-muted-foreground  border-4"}`}  w-10 h-10 rounded-full object-cover`}
          />
        </div>
        <div>
          <p className="font-semibold">{details.name}</p>
          <p className="text-muted-foreground text-xs">{label}</p>
          {/* <p className="text-xs text-muted-foreground">online</p> */}
        </div>
      </div>
      {room.type === "PERSONAL" && (
        <>
          <Button
            onClick={async () => {
              await blockUser();
            }}
            className="p-2"
          >
            {room.isBlocked ? "UnBlock" : "Block"}
          </Button>
        </>
      )}

      {/* 

      {menuOpen && (
        <div className="absolute right-4 top-14 bg-background shadow-lg border rounded-md w-40 z-40 text-sm">
          <div className="p-2 cursor-pointer">View Profile</div>
          <div className="p-2 cursor-pointer">Block User</div>
        </div>
      )} */}
    </div>
  );
}
