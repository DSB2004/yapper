import React, { useCallback, useState } from "react";
import { useMessageProvider } from "../provider";
import { ContextMenuItem } from "@/components/ui/context-menu";
import { SOCKET_EVENTS } from "@/constants/socket";
import { DELETE_MESSAGE_SOCKET_PAYLOAD } from "@/types/socket";
import { useSocket } from "@/provider/socket.provider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
export default function Delete() {
  const { socket } = useSocket();
  const [openDelete, setOpenDelete] = useState(false);
  const { msg, you } = useMessageProvider();
  const handleDelete = useCallback(() => {
    if (!socket) return;
    socket.emit(SOCKET_EVENTS.MESSAGE.DELETE, {
      messageId: msg.publicId,
      chatroomId: msg.chatroomId,
    } as DELETE_MESSAGE_SOCKET_PAYLOAD);

    setOpenDelete(false);
  }, [msg, socket]);

  if (!you) return <></>;
  return (
    <>
      <ContextMenuItem
        onSelect={(e) => {
          e.preventDefault();
          setOpenDelete(true);
        }}
        className="text-red-500"
      >
        Delete
      </ContextMenuItem>
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
    </>
  );
}
