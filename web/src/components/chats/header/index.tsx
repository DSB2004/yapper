"use client";

import Theme from "./theme";
// import User from "./user";
export default function Header() {
  return (
    <header className="border p-2 flex justify-between items-center">
      <h2 className="text-lg font-semibold">YAPPER</h2>
      <div className="flex items-center gap-2">
        <Theme></Theme>
        {/* <User></User> */}
      </div>
    </header>
  );
}
