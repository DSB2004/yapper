"use client";

import Link from "next/link";
import { ReactNode } from "react";
import clsx from "clsx";
import { MessageCircle, Phone, Settings } from "lucide-react";
import { usePathname } from "next/navigation";

import { useCallback } from "react";
type NavItemProps = {
  children: ReactNode;
  active: boolean;
  icon: ReactNode;
  disable?: boolean;
  href: string;
  className?: string;
};

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = useCallback(
    (path: string) => pathname.startsWith(path),
    [pathname],
  );

  return (
    <aside className=" border-r ">
      <div className="flex flex-col gap-5 p-3 h-full">
        <Link href={"/"}>
          <MessageCircle />
        </Link>
        <Link href="/calls">
          <Phone />
        </Link>
        <Link href="/settings" className="mt-auto">
          <Settings />
        </Link>
      </div>
    </aside>
  );
}
