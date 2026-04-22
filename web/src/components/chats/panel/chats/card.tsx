import { useUserStore } from "@/store/user.store";
import { Chatroom } from "@/types/chatroom";
import React, { useEffect, useMemo } from "react";
import { useChatroom } from "@/provider/chatroom.provider";
import Time from "../../common/time";
import Typing from "./ui/typing";
import { useMessage } from "@/provider/message,provider";

export default function Card({ room }: { room: Chatroom }) {
  const { join, online, typing } = useChatroom();
  const { unreadCount } = useMessage();
  const { data: user, isLoading, isFetching } = useUserStore();
  const details = useMemo(() => {
    if (room.type === "GROUP")
      return {
        icon: room.icon,
        name: room.name,
        userId: null,
        type: room.type,
        online: false,
      };
    else {
      const other = room.participants.find(
        (ele) => ele.userId !== user?.userId,
      );
      if (room.areYouBlocked && other) {
        return {
          icon: "/placeholder.webp",
          name: "Yapper User",
          userId: other.userId as string,
          type: room.type,
          online: false,
        };
      }
      if (other)
        return {
          icon: other.avatar,
          name: other.name,
          userId: other.userId as string,
          type: room.type,
          online: online.has(other.userId),
        };
    }
    return {
      icon: room.icon as string,
      name: room.name as string,
      userId: null,
      type: room.type,
      online: false,
    };
  }, [user, room, online]);
  // console.log(room);
  if (!room.lastMessage && room.createdBy.userId !== user?.userId) return <></>;
  return (
    <div
      onClick={() => join(room)}
      key={room.chatroomId}
      className="flex items-center gap-3 p-3  cursor-pointer transition"
    >
      {/* Avatar */}
      <div className="relative">
        <img
          src={details.icon}
          className={` ${!room.isBlocked && details.online ? " border-primary  border-4" : `${details.type === "GROUP" ? "border-transparent" : "border-muted-foreground  border-4"}`}  w-12 h-12 rounded-full object-cover`}
        />
        <div className="absolute z-10 -bottom-0.5 -right-1">
          {(details.online || details.type === "GROUP") &&
          typing.has(room.chatroomId) &&
          user &&
          typing.get(room.chatroomId)?.length === 1 &&
          !typing.get(room.chatroomId)?.includes(user.userId) ? (
            <Typing></Typing>
          ) : (
            <>
              {unreadCount.has(room.chatroomId) && (
                <div className="bg-primary h-4 w-4 text-xs rounded-full text-center">
                  {unreadCount.get(room.chatroomId)}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <p className="font-medium truncate">{details.name}</p>
          <span className="text-xs text-gray-500">
            {room.lastMessage ? (
              <Time time={room.lastMessage.createdAt}></Time>
            ) : (
              <Time time={room.createdAt}></Time>
            )}
          </span>
        </div>
        {room.lastMessage ? (
          <p className="text-sm text-gray-500 truncate">
            {room.lastMessage.previewText}
          </p>
        ) : (
          <p className="text-sm text-gray-500 truncate">Tap to Chat</p>
        )}
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
