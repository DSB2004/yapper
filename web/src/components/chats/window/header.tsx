"use client";
import { useChatroom } from "@/provider/chatroom.provider";
import { useUserStore } from "@/store/user.store";
import React, { useMemo, useState } from "react";

export default function ChatHeader() {
  // const [menuOpen, setMenuOpen] = useState(false);
  const { chatroom: room } = useChatroom();
  const { data: user } = useUserStore();
  if (!room) return <></>;

  const details = useMemo(() => {
    if (room.type === "GROUP") return { icon: room.icon, name: room.name };
    else {
      const other = room.participants.find(
        (ele) => ele.userId !== user?.userId,
      );
      if (other) return { icon: other.avatar, name: other.name };
    }
    return { icon: room.icon, name: room.name };
  }, [user, room]);
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b relative">
      <div className="flex items-center gap-3">
        <img src={details.icon} className="w-10 h-10 rounded-full" />
        <div>
          <p className="font-semibold">{details.name}</p>
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
