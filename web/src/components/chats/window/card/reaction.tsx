import React, { ReactNode } from "react";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

function ReactionContextWrapper({ children }: { children: ReactNode }) {
  return (
    <ContextMenu>
      <ContextMenuTrigger onBlur={(e) => e.stopPropagation()}>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent className="">
        <ContextMenuItem>Profile</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

export default function Reaction() {
  return (
    <ReactionContextWrapper>
      <></>
      {/* <div className=" -mt-4 ml-2 text-xs flex flex-wrap w-fit max-w-22 z-20 sticky  bg-primary rounded-sm p-0.5">
        <span>👍</span>
        <span>❤️</span>
        <span>👍</span>
      </div> */}
    </ReactionContextWrapper>
  );
}
