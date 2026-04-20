"use client";
import React, { useEffect, useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUserStore } from "@/store/user.store";
import { useWindow } from "../provider";
import { useInput } from "./provider";
import { Smile } from "lucide-react";

export default function Emoji() {
  const { data: user } = useUserStore();
  const { setText, text } = useInput();
  const [open, setOpen] = useState(false);
  const [emojis, setEmojis] = useState<string[]>([]);
  useEffect(() => {
    const cached = localStorage.getItem("emoji_list");
    if (cached) setEmojis(JSON.parse(cached));
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
      setText((prev) => prev + emoji);
    },
    [text, setText, user],
  );

  return (
    <>
      {/* QUICK REACTION BAR */}

      {/* ➕ OPEN DIALOG */}
      <button
        onClick={() => setOpen(true)}
        className="text-sm    rounded-full "
      >
        <Smile className=" text-muted-foreground hover:text-primary"></Smile>
      </button>

      {/* DIALOG */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Select Reaction</DialogTitle>
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
