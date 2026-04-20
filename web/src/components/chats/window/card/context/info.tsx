"use client";
import { useState, useMemo } from "react";
import { useMessageProvider } from "../provider";
import { ContextMenuItem } from "@/components/ui/context-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useChatroom } from "@/provider/chatroom.provider";
import { useUserStore } from "@/store/user.store";
import Time from "@/components/chats/common/time";

export default function Info() {
  const { chatroom } = useChatroom();
  const { data: currentUser } = useUserStore();
  const [openInfo, setOpenInfo] = useState(false);
  
  const { msg, you } = useMessageProvider();
  if (!you) return <></>;

  // 🔥 map userId → user details
  const userMap = useMemo(() => {
    const map: Record<string, any> = {};
    chatroom?.participants.forEach((u) => {
      map[u.userId] = u;
    });
    return map;
  }, [chatroom]);

  const renderUser = (userId: string) => {
    const user = userMap[userId];

    const isYou = currentUser?.userId === userId;

    return (
      <div key={userId} className="flex items-center gap-2 mb-1">
        <img src={user?.avatar} className="w-5 h-5 rounded-full object-cover" />
        <span className="text-sm">{isYou ? "You" : user?.name || userId}</span>
      </div>
    );
  };

  return (
    <>
      <ContextMenuItem
        onSelect={(e) => {
          e.preventDefault();
          setOpenInfo(true);
        }}
      >
        Info
      </ContextMenuItem>

      <Dialog open={openInfo} onOpenChange={setOpenInfo}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Message Info</DialogTitle>
          </DialogHeader>

          <div className="">
            <p className="text-xs text-muted-foreground">Delivered to</p>
            {msg.received?.length ? (
              <div className="flex flex-col gap-2 my-2">
                {msg.received.map((userId: string) => renderUser(userId))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Not delivered yet</p>
            )}
          </div>

        
          <div className="">
            <p className="text-xs text-muted-foreground">Seen by</p>
            {msg.seen?.length ? (
              <div className="flex flex-col gap-2 my-2">
                {msg.seen.map((userId: string) => renderUser(userId))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Not seen yet</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
