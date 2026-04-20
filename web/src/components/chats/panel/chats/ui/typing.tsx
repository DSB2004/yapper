import React from "react";

export default function Typing() {
  return (
    <div className=" bg-primary px-1.5 py-1.5 rounded-xl flex gap-0.5 items-center">
      <span className="w-1 h-1 bg-foreground rounded-full animate-bounce [animation-delay:-0.3s]" />
      <span className="w-1 h-1 bg-foreground rounded-full animate-bounce [animation-delay:-0.15s]" />
      <span className="w-1 h-1 bg-foreground rounded-full animate-bounce" />
    </div>
  );
}
