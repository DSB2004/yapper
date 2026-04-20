"use client";

import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useInput } from "./provider";

export default function AttachmentPreview() {
  const { attachments, setAttachments, handleSubmit, handleChange, text } =
    useInput();

  const open = attachments.length > 0;

  const removeFile = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={open} onOpenChange={() => setAttachments([])}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden">
        <DialogHeader className="p-3 border-b flex flex-row items-center justify-between">
          <DialogTitle className="text-sm">
            {attachments.length} selected
          </DialogTitle>

          <button onClick={() => setAttachments([])}>
            <X />
          </button>
        </DialogHeader>

        <div className="max-h-[300px] overflow-y-auto p-2 grid grid-cols-2 gap-2">
          {attachments.map((file, i) => {
            const isImage = file.url.match(/\.(jpg|jpeg|png|gif|webp)$/i);
            const isVideo = file.url.match(/\.(mp4|webm|ogg)$/i);

            if (isImage) {
              return (
                <div key={i} className="relative">
                  <img
                    src={file.url}
                    className="w-full h-40 object-cover rounded-lg"
                  />

                  <button
                    onClick={() => removeFile(i)}
                    className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1"
                  >
                    <X size={14} />
                  </button>
                </div>
              );
            }

            if (isVideo) {
              return (
                <div key={i} className="relative">
                  <video
                    src={file.url}
                    controls
                    className="w-full h-40 object-cover rounded-lg"
                  />

                  <button
                    onClick={() => removeFile(i)}
                    className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1"
                  >
                    <X size={14} />
                  </button>
                </div>
              );
            }

            return (
              <div
                key={i}
                className="bg-muted rounded-lg p-3 text-xs flex items-center justify-between"
              >
                <span className="truncate">{file.filename}</span>
                <button onClick={() => removeFile(i)}>
                  <X size={14} />
                </button>
              </div>
            );
          })}
        </div>

        <div className="p-3 border-t flex items-center gap-2">
          <input
            placeholder="Add a message..."
            value={text}
            onChange={handleChange}
            className="flex-1 bg-muted px-3 py-2 rounded-full text-sm outline-none"
          />

          <button
            onClick={handleSubmit}
            className="bg-primary text-white px-4 py-2 rounded-full text-sm"
          >
            Send
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
