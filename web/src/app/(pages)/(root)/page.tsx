import { redirect, RedirectType } from "next/navigation";
import React from "react";

export default function page() {
  redirect("/chats", RedirectType.replace);
}
