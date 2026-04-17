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
export function MessageCard({
  next,
  msg,
}: {
  next: Message | null;
  msg: Message;
}) {
  return (
    <MessageProviderWrapper next={next} msg={msg}>
      <Position>
        <ContextWrapper>
          <Container></Container>
        </ContextWrapper>
      </Position>
    </MessageProviderWrapper>
  );
}
