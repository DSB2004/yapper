import { useState } from "react";
import { useMessageProvider } from "../provider";
import { ContextMenuItem } from "@/components/ui/context-menu";

import { useWindow } from "../../provider";

export default function Reply() {
  const { msg } = useMessageProvider();
  const { setReplyTo } = useWindow();

  return (
    <>
      <ContextMenuItem
        onClick={() =>
          setReplyTo({
            messageId: msg.publicId,
            chatroomId: msg.chatroomId,
          })
        }
      >
        Reply
      </ContextMenuItem>
    </>
  );
}
