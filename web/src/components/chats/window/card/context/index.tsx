"use client";
import React, { useCallback, useEffect, useState } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

import { useMessageProvider } from "../provider";

import Copy from "./copy";
import Pin from "./pin";
import Star from "./star";
import Edit from "./edit";
import Delete from "./delete";
import Forward from "./forward";
import ReactionInfo from "./reply";
import Info from "./info";
import Reaction from "./reaction";
import Reply from "./reply";
export default function MessageContextMenu({
  children,
}: {
  children: React.ReactNode;
}) {
  const { msg } = useMessageProvider();
  if (msg.isDeleted) return <>{children}</>;
  return (
    <>
      {/* -------- CONTEXT MENU -------- */}
      <ContextMenu>
        <ContextMenuTrigger>{children}</ContextMenuTrigger>

        <ContextMenuContent className=" bg-transparent ring-0! border-none! shadow-none!">
          <Reaction></Reaction>
          <div className="bg-popover w-60 rounded-md">
            <Info></Info>
            <Forward></Forward>
            <Reply></Reply>
            <Copy></Copy>
            <Pin></Pin>
            <Star></Star>
            <Edit></Edit>
            <Delete></Delete>
          </div>
        </ContextMenuContent>
      </ContextMenu>
    </>
  );
}
