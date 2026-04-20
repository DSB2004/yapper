import React, { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useChatroom } from "@/provider/chatroom.provider";

export default function Typing() {
  const { chatroom, typing } = useChatroom();

  const users = useMemo(() => {
    if (!chatroom) return [];

    const typingUserIds = typing.get(chatroom.chatroomId) || [];

    return chatroom.participants.filter((p) =>
      typingUserIds.includes(p.userId),
    );
  }, [chatroom, typing]);

  return (
    <div className="h-10 flex items-center px-3">
      <AnimatePresence mode="wait">
        {chatroom && users.length > 0 && (
          <motion.div
            key="typing"
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{
              duration: 0.18,
              ease: "easeOut",
            }}
            className="flex items-center gap-2"
          >
            <div className="flex -space-x-2">
              {users.slice(0, 3).map((u) => (
                <img
                  key={u.userId}
                  src={u.avatar}
                  className="w-8 h-8 rounded-full border border-background"
                />
              ))}
            </div>

            <div className=" bg-primary px-1.5 py-1.5 rounded-xl flex gap-0.5 items-center">
              <span className="w-1 h-1 bg-foreground rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1 h-1 bg-foreground rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1 h-1 bg-foreground rounded-full animate-bounce" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
