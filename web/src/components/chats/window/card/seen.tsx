import React, { useMemo } from "react";
import { useMessageProvider } from "./provider";
import { useChatroom } from "@/provider/chatroom.provider";
import { CheckCheck, Check } from "lucide-react";
export default function Seen() {
  const { chatroom } = useChatroom();
  const { msg, you } = useMessageProvider();

  const seenByAll = useMemo(() => {
    if (!msg || !chatroom) return false;
    return (msg.seen ?? []).length === chatroom?.participants.length;
  }, [msg, chatroom]);
  const receviedByAll = useMemo(() => {
    if (!msg || !chatroom) return false;
    return (msg.received ?? []).length === chatroom?.participants.length;
  }, [msg, chatroom]);

  if (!you) return <></>;
  return (
    <div>
      {seenByAll ? (
        <CheckCheck className="stroke-blue-500 size-3" />
      ) : (
        <>
          {receviedByAll ? (
            <CheckCheck className="size-3" />
          ) : (
            <Check className="size-3" />
          )}
        </>
      )}
    </div>
  );
}
``;
