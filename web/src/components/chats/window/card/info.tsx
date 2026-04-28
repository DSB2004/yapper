import React from "react";
import { useMessageProvider } from "./provider";
import Time from "../../common/time";
import { Pin, Star } from "lucide-react";
import Reaction from "./reaction";

export default function Info() {
  const { msg } = useMessageProvider();
  return (
    <div className="flex gap-1 absolute top-2 right-2">
      {msg.isPinned && <Pin className="size-3 fill-white stroke-white" />}
      {msg.isStarred && (
        <Star className="size-3 fill-yellow-600 stroke-yellow-600" />
      )}
    </div>
  );
}
 