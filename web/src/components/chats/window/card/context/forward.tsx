import React, { useCallback, useState } from "react";
import { useMessageProvider } from "../provider";
import { ContextMenuItem } from "@/components/ui/context-menu";
import { SOCKET_EVENTS } from "@/constants/socket";
import {
  ADD_MESSAGE_SOCKET_PAYLOAD,
  UPDATE_MESSAGE_SOCKET_PAYLOAD,
} from "@/types/socket";
import { useSocket } from "@/provider/socket.provider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { generateCuid } from "@/utils";
import { useChatroomStore } from "@/store/chatroom.store";
import { useUserStore } from "@/store/user.store";

import { AvatarFallback, AvatarImage, Avatar } from "@/components/ui/avatar";
import { useChatroom } from "@/provider/chatroom.provider";
export default function Forward() {
  const { msg, you } = useMessageProvider();
  const { socket } = useSocket();
  const [openEdit, setOpenEdit] = useState(false);
  const { data: contacts } = useChatroomStore();
  const { data: user } = useUserStore();
  const { chatroom } = useChatroom();

  // ✅ store only IDs
  const [selectedRooms, setRoom] = useState<string[]>([]);

  /* ---------------- TOGGLE SELECT ---------------- */
  const toggleRoom = useCallback((id: string) => {
    setRoom(
      (prev) =>
        prev.includes(id)
          ? prev.filter((r) => r !== id) // remove
          : [...prev, id], // add
    );
  }, []);

  /* ---------------- HANDLE FORWARD ---------------- */
  const handleForward = useCallback(() => {
    if (!socket || selectedRooms.length === 0) return;

    selectedRooms.forEach((roomId) => {
      socket.emit(SOCKET_EVENTS.MESSAGE.ADD, {
        message: {
          publicId: generateCuid("message"),
          type: "GENERAL",
          attachments: msg.attachments,
          text: msg.text,
          for:
            contacts
              ?.find((ele) => ele.chatroomId === roomId)
              ?.participants.map((ele) => ele.userId) ?? [],
          isReply: false,
          replyFor: "",
          isForwarded: true,
        },
        createdAt: new Date(),
        chatroomId: roomId,
        by: user?.userId,
      } as ADD_MESSAGE_SOCKET_PAYLOAD);
    });

    setRoom([]); // reset selection
    setOpenEdit(false);
  }, [socket, selectedRooms, user, msg]);

  return (
    <>
      <ContextMenuItem
        onSelect={(e) => {
          e.preventDefault();
          setOpenEdit(true);
        }}
      >
        Forward
      </ContextMenuItem>

      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Forward Message</DialogTitle>
          </DialogHeader>

          <div className="space-y-2 max-h-72 overflow-y-auto">
            {contacts?.length === 0 && (
              <div className="text-center uppercase text-sm text-muted-foreground mt-4">
                No chats Found
              </div>
            )}

            {contacts
              ?.filter((ele) => ele.chatroomId !== chatroom?.chatroomId)
              .map((contact) => {
                let details;

                if (contact.type === "GROUP") {
                  details = {
                    icon: contact.icon,
                    name: contact.name,
                    chatroomId: contact.chatroomId,
                  };
                } else {
                  const other = contact.participants.find(
                    (ele) => ele.userId !== user?.userId,
                  );

                  if (other) {
                    details = {
                      icon: other.avatar,
                      name: other.name,
                      chatroomId: contact.chatroomId,
                    };
                  }
                }

                if (!details) return null;

                const isSelected = selectedRooms.includes(details.chatroomId);

                return (
                  <div
                    key={details.chatroomId}
                    onClick={() => toggleRoom(details.chatroomId)}
                    className={`flex items-center border gap-3 p-2 rounded-lg cursor-pointer transition ${
                      isSelected
                        ? "bg-muted border-primary"
                        : "border-border hover:bg-muted/50"
                    }`}
                  >
                    <Avatar>
                      <AvatarImage src={details.icon} />
                      <AvatarFallback>{details.name?.[0]}</AvatarFallback>
                    </Avatar>

                    <span className="text-sm flex-1">{details.name}</span>

                    {/* ✅ selection indicator */}
                    {isSelected && (
                      <div className="text-xs text-primary">✓</div>
                    )}
                  </div>
                );
              })}
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpenEdit(false)}>
              Cancel
            </Button>

            <Button
              disabled={selectedRooms.length === 0}
              onClick={handleForward}
            >
              Forward ({selectedRooms.length})
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
