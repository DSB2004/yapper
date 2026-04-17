"use client";
import React, { useCallback, useEffect, useState } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useSocket } from "@/provider/socket.provider";
import { SOCKET_EVENTS } from "@/constants/socket";
import { Message } from "react-hook-form";
import { useMessageProvider } from "./provider";
import {
  DELETE_MESSAGE_SOCKET_PAYLOAD,
  PINNED_MESSAGE_SOCKET_PAYLOAD,
  STARRED_MESSAGE_SOCKET_PAYLOAD,
  UPDATE_MESSAGE_SOCKET_PAYLOAD,
} from "@/types/socket";

export default function MessageContextMenu({
  children,
}: {
  children: React.ReactNode;
}) {
  const { socket } = useSocket();
  const { msg, you } = useMessageProvider();
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editText, setEditText] = useState<string>("");

  useEffect(() => {
    if (!msg) return;
    setEditText(msg.text ?? "");
  }, [msg]);

  const handleDelete = useCallback(() => {
    if (!socket) return;
    socket.emit(SOCKET_EVENTS.MESSAGE.DELETE, {
      messageId: msg.publicId,
      chatroomId: msg.chatroomId,
    } as DELETE_MESSAGE_SOCKET_PAYLOAD);

    setOpenDelete(false);
  }, [msg, socket]);
  /* ---------------- EDIT ---------------- */
  const handleEdit = useCallback(() => {
    if (!socket) return;
    socket.emit(SOCKET_EVENTS.MESSAGE.UPDATE, {
      messageId: msg.publicId,
      chatroomId: msg.chatroomId,
      message: {
        text: editText,
      },
    } as UPDATE_MESSAGE_SOCKET_PAYLOAD);

    setOpenEdit(false);
  }, [msg, socket]);

  const handleStar = useCallback(() => {
    if (!socket) return;
    socket.emit(SOCKET_EVENTS.MESSAGE.STAR, {
      messageId: msg.publicId,
      chatroomId: msg.chatroomId,
    } as STARRED_MESSAGE_SOCKET_PAYLOAD);

    setOpenEdit(false);
  }, [msg, socket]);

  const handlePin = useCallback(() => {
    if (!socket) return;
    socket.emit(SOCKET_EVENTS.MESSAGE.PIN, {
      messageId: msg.publicId,
      chatroomId: msg.chatroomId,
    } as PINNED_MESSAGE_SOCKET_PAYLOAD);

    setOpenEdit(false);
  }, [msg, socket]);

  return (
    <>
      {/* -------- CONTEXT MENU -------- */}
      <ContextMenu>
        <ContextMenuTrigger>{children}</ContextMenuTrigger>

        <ContextMenuContent className="w-40">
          <ContextMenuItem
            onClick={() => navigator.clipboard.writeText(msg.text ?? "")}
          >
            Copy
          </ContextMenuItem>
          <ContextMenuItem onClick={() => handlePin()}>Pin</ContextMenuItem>
          <ContextMenuItem onClick={() => handleStar()}>Star</ContextMenuItem>

          {you && (
            <>
              <ContextMenuItem onClick={() => setOpenEdit(true)}>
                Edit
              </ContextMenuItem>

              <ContextMenuItem
                onClick={() => setOpenDelete(true)}
                className="text-red-500"
              >
                Delete
              </ContextMenuItem>
            </>
          )}
        </ContextMenuContent>
      </ContextMenu>

      {/* -------- DELETE DIALOG -------- */}
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Message?</DialogTitle>
          </DialogHeader>

          <p className="text-sm text-muted-foreground">
            This will permanently delete the message from chat history.
          </p>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpenDelete(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* -------- EDIT DIALOG -------- */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Message</DialogTitle>
          </DialogHeader>

          <Input
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
          />

          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpenEdit(false)}>
              Cancel
            </Button>
            <Button onClick={handleEdit}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
