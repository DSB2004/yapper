import { useChatroom } from "@/provider/chatroom.provider";
import { useUserStore } from "@/store/user.store";
import { InfoEvent, Message } from "@/types/message";
import React, { useMemo } from "react";

export default function InfoMessage(msg: Message) {
  const { text } = msg;
  const { chatroom: room } = useChatroom();
  const { data: user } = useUserStore();
  const name = useMemo(() => {
    if (!room || room.type === "GROUP") return;
    const other = room.participants.find((ele) => ele.userId !== user?.userId);
    return other?.name;
  }, [user, room]);
  const label = useMemo(() => {
    if (text === InfoEvent.BLOCK) {
      return `You have blocked ${name}`;
    } else if (text === InfoEvent.UNBLOCK) {
      return `You have unblocked ${name}`;
    }
  }, [msg, name]);
  return (
    <div className="w-full p-2 flex items-center justify-center">
      <div className="w-fit py-1  px-2 rounded-sm text-sm text-muted-foreground bg-muted">
        {label}
      </div>
    </div>
  );
}
