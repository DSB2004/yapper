import { useChatroomStore } from "@/store/chatroom.store";
import React from "react";
import Card, { CardSkeleton } from "./card";

export default function Chatroom() {
  const { data, isLoading, isFetching } = useChatroomStore();

  if (!data || isLoading || isFetching)
    return (
      <>
        <CardSkeleton></CardSkeleton>
        <CardSkeleton></CardSkeleton>
        <CardSkeleton></CardSkeleton>
        <CardSkeleton></CardSkeleton>
      </>
    );
  return (
    <>
      {data.length === 0 && (
        <div className="text-center uppercase text-sm text-muted-foreground mx-auto mt-4">
          No chats Found
        </div>
      )}
      {data.map((room) => (
        <Card key={room.chatroomId} room={room} />
      ))}
    </>
  );
}
