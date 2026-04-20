import React, { useMemo } from "react";
import { useMessageProvider } from "./provider";
import { useChatroom } from "@/provider/chatroom.provider";
import { CheckCheck, Check } from "lucide-react";
export default function Seen() {
  const { chatroom } = useChatroom();
  const { msg, you, isDeleted } = useMessageProvider();

  const seenByAll =
    !!msg && !!chatroom && (msg.seen ?? []).length === (msg.for ?? []).length;

  const receviedByAll =
    !!msg &&
    !!chatroom &&
    (msg.received ?? []).length === (msg.for ?? []).length;

  if (!you || isDeleted) return <></>;
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
