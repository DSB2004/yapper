"use client";
import { useChatroom } from "@/provider/chatroom.provider";
import { useUserStore } from "@/store/user.store";
import { Message } from "@/types/message";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Time from "../../common/time";
import ContextWrapper from "./context";
import MessageProviderWrapper from "./provider";
import Position from "./position";
import Container from "./container";
import Attachment from "./attachment";
export function MessageCard({
  next,
  msg,
}: {
  next: Message | null;
  msg: Message;
}) {
  return (
    <div id={msg.publicId} className="p-2">
      <MessageProviderWrapper next={next} msg={msg}>
        <Position>
          <ContextWrapper>
            <div className="flex gap-2 flex-col">
              <Attachment></Attachment>
              <Container></Container>
            </div>
          </ContextWrapper>
        </Position>
      </MessageProviderWrapper>
    </div>
  );
}
