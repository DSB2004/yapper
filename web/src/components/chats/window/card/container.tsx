import React from "react";
import { useMessageProvider } from "./provider";
import Time from "../../common/time";
import Info from "./info";
import { Pin, Star } from "lucide-react";
import Reaction from "./reaction";
import User from "./user";
import Seen from "./seen";
import Reply from "./reply-preview";
import ReplyPreview from "./reply-preview";

export default function Container() {
  const { msg, you, user, showAvatar, isDeleted } = useMessageProvider();
  if (isDeleted) {
    return (
      <>
        <div className="relative">
          <div
            className={`bg-muted z-10 relative flex flex-col gap-2 max-w-72 min-w-48 p-2 rounded-sm  ${you ? "rounded-bl-none" : "rounded-br-none"}`}
          >
            <p className="text-sm text-muted-foreground">
              This message has been deleted
            </p>
          </div>
        </div>
      </>
    );
  }
  if (!msg.text) return <></>;
  return (
    <>
      <div className="relative">
        <div
          className={`bg-muted z-10 relative flex flex-col gap-2 max-w-80 min-w-48 p-2 rounded-sm  ${you ? "rounded-bl-none" : "rounded-br-none"}`}
        >
          {msg.isForwarded && (
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground italic">
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
          )}
          <ReplyPreview></ReplyPreview>
          <p className="text-sm"> {msg.text}</p>
          <Info></Info>
          <div className="flex w-full text-[10px]  justify-between items-center">
            {msg.isUpdated ? (
              <span className="text-muted-foreground mr-2">Edited</span>
            ) : (
              <>
                <span></span>
              </>
            )}

            <div className="flex items-center gap-2">
              <Time time={msg.createdAt}></Time>
              <Seen></Seen>
            </div>
          </div>
        </div>
        <div className={`flex   justify-between`}>
          <Reaction></Reaction>
          {showAvatar && <User></User>}
        </div>
      </div>
    </>
  );
}
