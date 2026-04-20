import React, { ReactNode, useCallback, useMemo } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useMessageProvider } from "./provider";
import { useChatroom } from "@/provider/chatroom.provider";
import { useUserStore } from "@/store/user.store";
import { SOCKET_EVENTS } from "@/constants/socket";
import { useSocket } from "@/provider/socket.provider";
import { REACTION_MESSAGE_SOCKET_PAYLOAD } from "@/types/socket";

function ReactionContextWrapper({
  children,
  groupedUsers,
}: {
  children: ReactNode;
  groupedUsers: Record<string, string[]>;
}) {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div>{children}</div>
      </ContextMenuTrigger>

      <ContextMenuContent>
        <ReactionDetails />
      </ContextMenuContent>
    </ContextMenu>
  );
}

function ReactionDetails() {
  const { msg } = useMessageProvider();
  const { chatroom } = useChatroom();
  const { data: currentUser } = useUserStore();
  const { socket } = useSocket();

  const handleRemoveReact = useCallback(() => {
    if (!socket || !currentUser) return;

    socket.emit(SOCKET_EVENTS.MESSAGE.REACTION, {
      messageId: msg.publicId,
      chatroomId: msg.chatroomId,
      reactionBy: currentUser.userId,
      reaction: "", // remove
    } as REACTION_MESSAGE_SOCKET_PAYLOAD);
  }, [socket, msg, currentUser]);

  /* ---------------- USER MAP ---------------- */
  const userMap = useMemo(() => {
    const map: Record<string, any> = {};
    chatroom?.participants.forEach((u) => {
      map[u.userId] = u;
    });
    return map;
  }, [chatroom]);

  /* ---------------- FILTER VALID ---------------- */
  const validReactions = useMemo(() => {
    return (msg.reactions ?? []).filter((r: any) => r.reaction);
  }, [msg.reactions]);

  /* ---------------- GROUPED ---------------- */
  const grouped = useMemo(() => {
    const map: Record<string, any[]> = {};

    validReactions.forEach((r: any) => {
      if (!map[r.reaction]) map[r.reaction] = [];
      map[r.reaction].push(r);
    });

    return map;
  }, [validReactions]);

  const total = validReactions.length;

  return (
    <div className="w-80 bg-popover rounded-xl shadow-lg p-3">
      {/* HEADER */}
      <div className="text-xs text-muted-foreground mb-2">
        {total} reaction{total !== 1 && "s"}
      </div>

      {/* EMOJI FILTER BAR */}
      <div className="flex gap-2 mb-3">
        {Object.entries(grouped).map(([emoji, list]) => (
          <div
            key={emoji}
            className="flex items-center gap-1 px-2 py-1 rounded-full bg-muted text-sm"
          >
            <span>{emoji}</span>
            <span>{list.length}</span>
          </div>
        ))}
      </div>

      {/* USER LIST */}
      <div className="flex flex-col gap-3 max-h-64 overflow-y-auto">
        {validReactions.map((r: any, i: number) => {
          const user = userMap[r.userId];
          const isYou = currentUser?.userId === r.userId;

          return (
            <div key={i} className="flex items-center justify-between">
              {/* LEFT */}
              <div
                className={`flex items-center gap-2 ${
                  isYou ? "cursor-pointer hover:opacity-70" : ""
                }`}
                onClick={() => {
                  if (isYou) handleRemoveReact();
                }}
              >
                <img
                  src={user?.avatar}
                  className="w-8 h-8 rounded-full object-cover"
                />

                <div className="flex flex-col">
                  <span className="text-sm">
                    {isYou ? "You" : user?.name || r.userId}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {user?.phone || ""}
                  </span>
                </div>
              </div>

              {/* RIGHT EMOJI */}
              <div className="text-lg">{r.reaction}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Reaction() {
  const { msg } = useMessageProvider();

  const grouped = useMemo(() => {
    const map: Record<string, any[]> = {};

    (msg.reactions ?? []).forEach((r: any) => {
      if (!r.reaction) return;

      if (!map[r.reaction]) map[r.reaction] = [];
      map[r.reaction].push(r);
    });

    return map;
  }, [msg.reactions]);

  const groupedUsers = useMemo(() => {
    const map: Record<string, string[]> = {};

    (msg.reactions ?? []).forEach((r: any) => {
      if (!r.reaction) return;

      if (!map[r.reaction]) map[r.reaction] = [];
      map[r.reaction].push(r.userId);
    });

    return map;
  }, [msg.reactions]);

  return (
    <>
      {Object.entries(grouped).length === 0 ? (
        <>
          <div></div>
        </>
      ) : (
        <>
          <ReactionContextWrapper groupedUsers={groupedUsers}>
            <div className="-mt-4 ml-2 text-xs flex flex-wrap gap-1 w-fit max-w-28 items-center justify-start z-20 sticky bg-primary rounded-sm p-1">
              {Object.entries(grouped).map(([emoji, list]) => {
                const count = list.length;

                if (count === 1)
                  return (
                    <div key={emoji} className="flex items-center rounded-full">
                      <span>{emoji}</span>
                    </div>
                  );

                return (
                  <div
                    key={emoji}
                    className="flex items-center gap-0.5 bg-background/20 py-0.5 px-1 rounded-full"
                  >
                    <span>{emoji}</span>
                    <span>{count}</span>
                  </div>
                );
              })}
            </div>
          </ReactionContextWrapper>
        </>
      )}
    </>
  );
}
