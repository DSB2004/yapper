"use client";
import React, { useState } from "react";
import { useMessageProvider } from "./provider";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Time from "../../common/time";
import Seen from "./seen";
import Reaction from "./reaction";
import User from "./user";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

function AttachmentCarousel({ attachments }: { attachments: any[] }) {
  const isImage = (url: string) => url.match(/\.(jpg|jpeg|png|gif|webp)$/i);

  const isVideo = (url: string) => url.match(/\.(mp4|webm|ogg)$/i);

  return (
    <div className="w-full h-[50vh]  flex items-center justify-center">
      <Carousel className="w-full h-fit rounded-xl">
        <CarouselContent className="h-full">
          {attachments.map((file, i) => (
            <CarouselItem
              key={i}
              className="flex items-center justify-center h-full"
            >
              {/* IMAGE */}
              {isImage(file.url) && (
                <img
                  src={file.url}
                  className="max-h-full max-w-full object-contain"
                />
              )}

              {/* VIDEO */}
              {isVideo(file.url) && (
                <video
                  src={file.url}
                  controls
                  className="max-h-full max-w-full"
                />
              )}

              {/* FILE */}
              {!isImage(file.url) && !isVideo(file.url) && (
                <a
                  href={file.url}
                  target="_blank"
                  className="bg-white text-black px-4 py-2 rounded"
                >
                  {file.filename}
                </a>
              )}
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* NAV BUTTONS */}
        {attachments.length > 1 && (
          <>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </>
        )}
      </Carousel>
    </div>
  );
}

export default function Attachment() {
  const { msg, showAvatar } = useMessageProvider();
  const [open, setOpen] = useState(false);

  if (!msg.attachments?.length) return null;

  const attachments = msg.attachments;
  const count = attachments.length;

  const isImage = (url: string) => url.match(/\.(jpg|jpeg|png|gif|webp)$/i);
  const isVideo = (url: string) => url.match(/\.(mp4|webm|ogg)$/i);

  const showOverlay = !msg.text;

  const renderItem = (
    file: any,
    className: string,
    overlay?: number,
    showMeta?: boolean,
  ) => (
    <>
      <div className={`relative overflow-hidden rounded-lg ${className}`}>
        {isImage(file.url) && (
          <img src={file.url} className="w-full h-full object-cover" />
        )}

        {isVideo(file.url) && (
          <video src={file.url} className="w-full h-full object-cover" />
        )}

        {!isImage(file.url) && !isVideo(file.url) && (
          <div className="w-full h-full bg-muted flex items-center justify-center text-xs p-2 text-center">
            {file.filename}
          </div>
        )}

        {/* +N overlay */}
        {overlay && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xl font-semibold">
            +{overlay}
          </div>
        )}

        {/* 🔥 TIME + SEEN OVERLAY */}
        {showMeta && showOverlay && (
          <div className="absolute bottom-1 right-1 bg-black/60 px-1.5 py-0.5 rounded text-[10px] flex items-center gap-1 text-white">
            <Time time={msg.createdAt} />
            <Seen />
          </div>
        )}
      </div>
    </>
  );

  return (
    <>
      <div
        className="mt-2 max-w-xs cursor-pointer relative"
        onClick={() => setOpen(true)}
      >
        {msg.isForwarded && !msg.text && (
          <>
            <div className="flex items-center absolute top-1 left-1 z-50 bg-black/60 gap-0.5  p-0.5 px-1 pr-2 rounded text-[10px] text-white italic">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-3 h-3 opacity-70"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
              Forwarded
            </div>
          </>
        )}

        {/* 1 IMAGE */}
        {count === 1 && (
          <div className="w-full h-60">
            {renderItem(attachments[0], "w-full h-full", undefined, true)}
          </div>
        )}

        {/* 2 IMAGES */}
        {count === 2 && (
          <div className="grid grid-cols-2 gap-1 h-40">
            {attachments.map((file, i) =>
              renderItem(file, "w-full h-full", undefined, i === 1),
            )}
          </div>
        )}

        {/* 3 IMAGES */}
        {count === 3 && (
          <div className="flex flex-col gap-1">
            <div className="grid grid-cols-2 gap-1 h-32">
              {attachments
                .slice(0, 2)
                .map((file, i) =>
                  renderItem(file, "w-full h-full", undefined, false),
                )}
            </div>

            <div className="h-32">
              {renderItem(attachments[2], "w-full h-full", undefined, true)}
            </div>
          </div>
        )}

        {/* 4+ IMAGES */}
        {count >= 4 && (
          <div className="grid grid-cols-2 gap-1 h-80">
            {attachments.slice(0, 4).map((file, i) => {
              const isLast = i === 3;
              const remaining = count - 4;

              return renderItem(
                file,
                "w-full h-full",
                isLast && remaining > 0 ? remaining : undefined,
                isLast,
              );
            })}
          </div>
        )}

        <div className={`flex   justify-between`}>
          <Reaction></Reaction>
          {showAvatar && !msg.text && <User></User>}
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[600px]! p-0 overflow-hidden">
          <AttachmentCarousel attachments={attachments} />
        </DialogContent>
      </Dialog>
    </>
  );
}
