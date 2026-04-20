"use client";
import React, { useRef, useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Image, File, Video } from "lucide-react";
import { upload } from "@/app/actions/uploads/upload.action";
import { useInput } from "./provider";
export default function Attachment() {
  const [open, setOpen] = useState(false);

  const { attachments, setAttachments } = useInput();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  /* ---------------- HANDLE FILE SELECT ---------------- */
  const handleFiles = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files) return;

      const files = Array.from(e.target.files);

      for (let file of files) {
        const res = await upload([file]);
        const url = (res.urls ?? [""])[0];
        setAttachments((prev) => [
          ...prev,
          { filename: file.name, filesize: file.size, url },
        ]);
      }
    },
    [],
  );

  return (
    <>
      {/* ➕ BUTTON */}
      <button onClick={() => setOpen(true)} className="rounded-full">
        <Plus className="text-muted-foreground hover:text-primary" />
      </button>

      {/* HIDDEN INPUTS */}
      <input
        type="file"
        accept="image/*"
        multiple
        ref={imageInputRef}
        onChange={handleFiles}
        hidden
      />
      <input
        type="file"
        accept="video/*"
        multiple
        ref={videoInputRef}
        onChange={handleFiles}
        hidden
      />
      <input
        type="file"
        multiple
        ref={fileInputRef}
        onChange={handleFiles}
        hidden
      />

      {/* DIALOG */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Attachments</DialogTitle>
          </DialogHeader>

          {/* OPTIONS */}
          <div className="flex justify-around py-4">
            <button
              onClick={() => {
                setOpen(false);
                setTimeout(() => imageInputRef.current?.click(), 0);
              }}
              className="flex flex-col items-center gap-1"
            >
              <Image className="size-6" />
              <span className="text-xs">Photo</span>
            </button>

            <button
              onClick={() => {
                setOpen(false);
                setTimeout(() => videoInputRef.current?.click(), 0);
              }}
              className="flex flex-col items-center gap-1"
            >
              <Video className="size-6" />
              <span className="text-xs">Video</span>
            </button>

            <button
              onClick={() => {
                setOpen(false);
                setTimeout(() => fileInputRef.current?.click(), 0);
              }}
              className="flex flex-col items-center gap-1"
            >
              <File className="size-6" />
              <span className="text-xs">File</span>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
