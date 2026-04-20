import React, { ReactNode } from "react";
import { useMessageProvider } from "./provider";

export default function Position({ children }: { children: ReactNode }) {
  const { you, msg } = useMessageProvider();
  return (
    <div className={`flex gap-2   ${you ? "justify-end" : "justify-start"} `}>
      {children}
    </div>
  );
}
