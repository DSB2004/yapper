import React, { useCallback } from "react";
import { useMessageProvider } from "../provider";
import { ContextMenuItem } from "@/components/ui/context-menu";
import { SOCKET_EVENTS } from "@/constants/socket";
import { PINNED_MESSAGE_SOCKET_PAYLOAD } from "@/types/socket";
import { useSocket } from "@/provider/socket.provider";

export default function Pin() {
  const { msg } = useMessageProvider();
  const { socket } = useSocket();
  const handlePin = useCallback(() => {
    if (!socket) return;
    socket.emit(SOCKET_EVENTS.MESSAGE.PIN, {
      messageId: msg.publicId,
      chatroomId: msg.chatroomId,
    } as PINNED_MESSAGE_SOCKET_PAYLOAD);
  }, [msg, socket]);
  return <ContextMenuItem onClick={() => handlePin()}>Pin</ContextMenuItem>;
}
