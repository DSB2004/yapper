import React from "react";
import { useMessageProvider } from "./provider";

export default function User() {
  const { user, you } = useMessageProvider();
  
  return (
    <div className="flex gap-2   mt-2 items-center">
      <img
        height={30}
        className="rounded-full"
        width={30}
        src={user.avatar}
        alt={user.name}
      />
    </div>
  );
}
