import { useUserStore } from "@/store/user.store";
import { Chatroom } from "@/types/chatroom";
import React, { useMemo } from "react";
import { useChatroom } from "@/provider/chatroom.provider";
export default function Card({ room }: { room: Chatroom }) {
  const { join } = useChatroom();
  const { data: user, isLoading, isFetching } = useUserStore();
  const details = useMemo(() => {
    if (room.type === "GROUP") return { icon: room.icon, name: room.name };
    else {
      const other = room.participants.find(
        (ele) => ele.userId !== user?.userId,
      );
      if (other) return { icon: other.avatar, name: other.name };
    }
    return { icon: room.icon, name: room.name };
  }, [user, room]);

  return (
    <div
      onClick={() => join(room)}
      key={room.chatroomId}
      className="flex items-center gap-3 p-3  cursor-pointer transition"
    >
      {/* Avatar */}
      <img
        src={details.icon}
        alt={details.name}
        className="w-12 h-12 rounded-full object-cover"
      />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <p className="font-medium truncate">{details.name}</p>
          <span className="text-xs text-gray-500">
            {new Date(room.createdAt).getHours()}:
            {new Date(room.createdAt).getMinutes()}
          </span>
        </div>

        <p className="text-sm text-gray-500 truncate">Tap to Chat</p>
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3 animate-pulse">
      {/* Avatar Skeleton */}
      <div className="w-12 h-12 rounded-full bg-muted" />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          {/* Name Skeleton */}
          <div className="h-4 w-32 bg-muted rounded" />

          {/* Time Skeleton */}
          <div className="h-3 w-10 bg-muted rounded" />
        </div>

        {/* Subtitle Skeleton */}
        <div className="h-3 w-24 bg-muted rounded mt-2" />
      </div>
    </div>
  );
}
