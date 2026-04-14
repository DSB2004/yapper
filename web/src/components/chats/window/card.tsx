"use client";
import React, { useEffect, useRef, useState } from "react";

type Message = {
  id: string;
  text: string;
  time: string;
  sender: "me" | "other";
};

export default function Card({ msg }: { msg: Message }) {


  return (
    <div
    
      className={`flex gap-2 ${
        msg.sender === "me" ? "justify-end" : "justify-start"
      }`}
    >
   
      {msg.sender === "other" && (
        <img
          src="https://i.pravatar.cc/100?img=5"
          className="w-8 h-8 rounded-full"
        />
      )}

      <div className="relative max-w-xs">
        <div
          className={`px-3 py-2 rounded-lg text-sm shadow
          ${msg.sender === "me" ? "bg-secondary rounded-bl-none" : "bg-foreground rounded-br-none text-black"}`}
        >
          {msg.text}
        </div>

        <div className="text-[10px] text-muted-foreground mt-1 text-right">
          {msg.time}
        </div>
      </div>
    </div>
  );
}
