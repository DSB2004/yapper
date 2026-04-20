import React, { useCallback } from "react";
import { useMessageProvider } from "../provider";
import { ContextMenuItem } from "@/components/ui/context-menu";
import { SOCKET_EVENTS } from "@/constants/socket";
import { STARRED_MESSAGE_SOCKET_PAYLOAD } from "@/types/socket";
import { useSocket } from "@/provider/socket.provider";

export default function Star() {
  const { msg } = useMessageProvider();
  const { socket } = useSocket();
  const handleStar = useCallback(() => {
    if (!socket) return;
    socket.emit(SOCKET_EVENTS.MESSAGE.STAR, {
      messageId: msg.publicId,
      chatroomId: msg.chatroomId,
    } as STARRED_MESSAGE_SOCKET_PAYLOAD);
  }, [msg, socket]);
  return <ContextMenuItem onClick={() => handleStar()}>Star</ContextMenuItem>;
}
