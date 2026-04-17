import React from "react";
import { useMessageProvider } from "./provider";
import Time from "../../common/time";
import Info from "./info";
import { Pin, Star } from "lucide-react";
import Reaction from "./reaction";
import User from "./user";
import Seen from "./seen";

export default function Container() {
  const { msg, you, user, showAvatar } = useMessageProvider();

  return (
    <>
      <div className="relative">
        <div
          className={`bg-muted z-10 relative flex flex-col gap-2 max-w-72 min-w-48 p-2 rounded-sm  ${you ? "rounded-bl-none" : "rounded-br-none"}`}
        >
          <p className="text-sm"> {msg.text}</p>
          <Info></Info>
          <div className="flex w-full justify-end items-center">
            <span className="text-[10px] flex items-center gap-1 justify-end">
              <Time time={msg.createdAt}></Time>
              <Seen></Seen>
            </span>
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
