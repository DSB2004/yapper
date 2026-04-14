import React, { ReactNode } from "react";

import { ChatroomStore } from "@/store/chatroom.store";
import { ChatroomProvider } from "@/provider/chatroom.provider";
export default function layout({ children }: { children: ReactNode }) {
  return (
    <ChatroomStore>
      <ChatroomProvider>{children}</ChatroomProvider>
    </ChatroomStore>
  );
}
