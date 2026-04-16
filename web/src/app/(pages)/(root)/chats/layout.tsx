import React, { ReactNode } from "react";

import { ChatroomStore } from "@/store/chatroom.store";
import { ChatroomProvider } from "@/provider/chatroom.provider";
import { MessageStore } from "@/store/message.store";
import { MessageProvider } from "@/provider/message,provider";
export default function layout({ children }: { children: ReactNode }) {
  return (
    <ChatroomStore>
      <ChatroomProvider>
        <MessageStore>
          <MessageProvider>{children}</MessageProvider>
        </MessageStore>
      </ChatroomProvider>
    </ChatroomStore>
  );
}
