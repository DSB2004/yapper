"use client";
import React, { useEffect, useState, useCallback } from "react";
import { ContextMenuItem } from "@/components/ui/context-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSocket } from "@/provider/socket.provider";
import { useMessageProvider } from "../provider";
import { SOCKET_EVENTS } from "@/constants/socket";
import { Plus } from "lucide-react";
import { REACTION_MESSAGE_SOCKET_PAYLOAD } from "@/types/socket";
import { useUserStore } from "@/store/user.store";

const DEFAULT = ["👍", "❤️", "😂", "😮", "😢", "🙏"];

export default function Reaction() {
  const { socket } = useSocket();
  const { msg } = useMessageProvider();
  const { data: user } = useUserStore();
  const [open, setOpen] = useState(false);
  const [emojis, setEmojis] = useState<string[]>(DEFAULT);
  const [recent, setRecent] = useState<string[]>([]);

  /* ---------------- LOAD CACHE ---------------- */
  useEffect(() => {
    const cached = localStorage.getItem("emoji_list");
    const recentCache = localStorage.getItem("recent_emojis");

    if (cached) setEmojis(JSON.parse(cached));
    if (recentCache) setRecent(JSON.parse(recentCache));

    if (!cached) {
      fetch("https://unpkg.com/emoji.json/emoji.json")
        .then((res) => res.json())
        .then((data) => {
          const list = data.map((e: any) => e.char).slice(0, 200);
          setEmojis(list);
          localStorage.setItem("emoji_list", JSON.stringify(list));
        });
    }
  }, []);

  /* ---------------- HANDLE REACTION ---------------- */
  const handleReact = useCallback(
    (emoji: string) => {
      if (!socket || !user) return;

      socket.emit(SOCKET_EVENTS.MESSAGE.REACTION, {
        messageId: msg.publicId,
        chatroomId: msg.chatroomId,
        reactionBy: user.userId,
        reaction: emoji,
      } as REACTION_MESSAGE_SOCKET_PAYLOAD);

      const updated = [emoji, ...recent.filter((e) => e !== emoji)].slice(0, 6);

      setRecent(updated);
      localStorage.setItem("recent_emojis", JSON.stringify(updated));

      setOpen(false);
    },
    [socket, msg, recent, user],
  );

  const quickBar = [...recent, ...DEFAULT]
    .filter((v, i, a) => a.indexOf(v) === i)
    .slice(0, 6);

  return (
    <>
      {/* QUICK REACTION BAR */}
      <div className="w-60 bg-popover p-1.5 rounded-3xl flex justify-between shadow-md mb-3">
        {quickBar.map((emoji, i) => (
          <button
            key={i}
            onClick={() => handleReact(emoji)}
            className="text-lg hover:scale-110 rounded-full transition"
          >
            {emoji}
          </button>
        ))}

        {/* ➕ OPEN DIALOG */}
        <button
          onClick={() => setOpen(true)}
          className="text-sm  hover:scale-110   rounded-full "
        >
          <Plus className="size-4"></Plus>
        </button>
      </div>

      {/* DIALOG */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Pick Reaction</DialogTitle>
          </DialogHeader>

          <div className="flex flex-wrap gap-2 max-h-[300px] overflow-y-auto">
            {emojis.map((emoji, i) => (
              <button
                key={i}
                onClick={() => handleReact(emoji)}
                className="text-lg hover:scale-125 p-1 rounded"
              >
                {emoji}
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
