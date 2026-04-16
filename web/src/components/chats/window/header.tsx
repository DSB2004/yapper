"use client";
import { useChatroom } from "@/provider/chatroom.provider";
import { useUserStore } from "@/store/user.store";
import React, { useMemo, useState } from "react";

export default function ChatHeader() {
  // const [menuOpen, setMenuOpen] = useState(false);
  const { chatroom: room, online, inChat } = useChatroom();
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
    if (room.type === "PERSONAL") {
      if (!details.userId) return "Offline";

      const usersInChat = inChat.get(room.chatroomId) || [];

      if (usersInChat.includes(details.userId)) {
        return "In chat";
      }

      if (online.has(details.userId)) {
        return "Online";
      }

      return "Offline";
    } else {
      const usersInChat = inChat.get(room.chatroomId) || [];

      const others = room.participants; // don't remove yourself now

      const activeUsers = others.filter((p) => usersInChat.includes(p.userId));

      const formatName = (p: (typeof others)[number]) =>
        p.userId === user?.userId ? "You" : p.name;

      if (activeUsers.length > 0) {
        const names = activeUsers.map(formatName);

        if (names.length <= 3) {
          return `${names.join(", ")} ${
            names.length === 1 ? "is" : "are"
          } in chat`;
        }

        return `${names.slice(0, 3).join(", ")} and ${
          names.length - 3
        } others are in chat`;
      }

      const names = others.map(formatName);

      if (names.length <= 3) {
        return names.join(", ");
      }

      return `${names.slice(0, 3).join(", ")}...`;
    }
  }, [details, room, online, inChat]);

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b relative">
      <div className="flex items-center gap-3">
        <div className="relative">
          <img
            src={details.icon}
            className={` ${details.online ? " border-green-600  border-4" : `${details.type === "GROUP" ? "border-transparent" : "border-muted-foreground  border-4"}`}  w-10 h-10 rounded-full object-cover`}
          />
        </div>
        <div>
          <p className="font-semibold">{details.name}</p>
          <p className="text-muted-foreground text-xs">{label}</p>
          {/* <p className="text-xs text-muted-foreground">online</p> */}
        </div>
      </div>

      {/* <button onClick={() => setMenuOpen(!menuOpen)} className="p-2">
        ⋮
      </button>

      {menuOpen && (
        <div className="absolute right-4 top-14 bg-background shadow-lg border rounded-md w-40 z-40 text-sm">
          <div className="p-2 cursor-pointer">View Profile</div>
          <div className="p-2 cursor-pointer">Block User</div>
        </div>
      )} */}
    </div>
  );
}
