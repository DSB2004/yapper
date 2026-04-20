import React from "react";
import { useMessageProvider } from "../provider";
import { ContextMenuItem } from "@/components/ui/context-menu";

export default function Copy() {
  const { msg } = useMessageProvider();
  return (
    <ContextMenuItem
      onClick={() => navigator.clipboard.writeText(msg.text ?? "")}
    >
      Copy
    </ContextMenuItem>
  );
}
