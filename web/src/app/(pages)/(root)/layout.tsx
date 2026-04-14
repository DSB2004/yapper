import { SidebarProvider } from "@/provider/sidebar.provider";
import { UserStore } from "@/store/user.store";
import React, { ReactNode } from "react";
import Sidebar from "@/components/chats/sidebar";
import Navbar from "@/components/chats/header";
import { SocketProvider } from "@/provider/socket.provider";
export default function layout({ children }: { children: ReactNode }) {
  return (
    <UserStore>
      <SocketProvider>
        <SidebarProvider>
          <div className="flex h-screen flex-col items-stretch bg-background">
            <Navbar></Navbar>
            <div className="flex flex-1">
              <Sidebar></Sidebar>
              {children}
            </div>
          </div>
        </SidebarProvider>
      </SocketProvider>
    </UserStore>
  );
}
