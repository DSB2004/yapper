import React, { useCallback, useState } from "react";
import { useMessageProvider } from "../provider";
import { ContextMenuItem } from "@/components/ui/context-menu";
import { SOCKET_EVENTS } from "@/constants/socket";
import { UPDATE_MESSAGE_SOCKET_PAYLOAD } from "@/types/socket";
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
export default function Edit() {
  const { msg, you } = useMessageProvider();
  const { socket } = useSocket();
  const [openEdit, setOpenEdit] = useState(false);
  const [editText, setEditText] = useState<string>(msg.text ?? "");
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
  }, [msg, socket, editText]);
  if (!you) return <></>;
  return (
    <>
      <ContextMenuItem
        onSelect={(e) => {
          e.preventDefault();
          setOpenEdit(true);
        }}
      >
        Edit
      </ContextMenuItem>
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
