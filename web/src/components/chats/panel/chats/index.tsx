"use client";

import React, { useState } from "react";
import CreateGroup from "./create-group";
import CreateContact from "./create-contact";
import { Button } from "@/components/ui/button";
import { MessageCircle, UserPlus, Users } from "lucide-react";
import Chatrooms from "./chatroom";
type ViewType = "chats" | "contact" | "group";

export default function Chats() {
  const [view, setView] = useState<ViewType>("chats");

  return (
    <div className="flex flex-col h-full w-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-16 border-b">
        <h2 className="text-lg font-semibold">Chats</h2>

        <div className="flex gap-2">
          <Button
            variant={view === "chats" ? "default" : "ghost"}
            size="icon"
            onClick={() => setView("chats")}
          >
            <MessageCircle className="h-5 w-5" />
          </Button>

          <Button
            variant={view === "contact" ? "default" : "ghost"}
            size="icon"
            onClick={() => setView("contact")}
          >
            <UserPlus className="h-5 w-5" />
          </Button>

          <Button
            variant={view === "group" ? "default" : "ghost"}
            size="icon"
            onClick={() => setView("group")}
          >
            <Users className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 relative">
        <div className="absolute top-0 left-0 h-full w-full overflow-hidden">
          <div className="h-full overflow-y-auto no-scrollbar">
            {view === "chats" && <Chatrooms />}

            {view === "contact" && (
              <div className="p-4">
                <CreateContact />
              </div>
            )}

            {view === "group" && (
              <div className="p-4">
                <CreateGroup />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
