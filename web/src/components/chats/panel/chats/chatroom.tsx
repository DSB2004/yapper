import { useChatroomStore } from "@/store/chatroom.store";
import React from "react";
import Card, { CardSkeleton } from "./card";
import { useUserStore } from "@/store/user.store";

export default function Chatroom() {
  const { data, isLoading, isFetching } = useChatroomStore();
  const { data: user } = useUserStore();
  if (!data || isLoading || isFetching)
    return (
      <>
        <CardSkeleton></CardSkeleton>
        <CardSkeleton></CardSkeleton>
        <CardSkeleton></CardSkeleton>
        <CardSkeleton></CardSkeleton>
      </>
    );
  const chats = data.filter(
    (room) => room.lastMessage || room.createdBy.userId === user?.userId,
  );
  return (
    <>
      {chats.length === 0 && (
        <div className="text-center uppercase text-sm text-muted-foreground mx-auto mt-4">
          No chats Found
        </div>
      )}
      {chats.map((room) => (
        <Card key={room.chatroomId} room={room} />
      ))}
    </>
  );
}
