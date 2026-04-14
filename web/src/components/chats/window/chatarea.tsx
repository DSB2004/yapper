"use client";
import React, { useState } from "react";
import Card from "./card";

type Message = {
  id: string;
  text: string;
  time: string;
  sender: "me" | "other";
};

const messages: Message[] = [
  { id: "1", text: "Hey, how are you?", time: "17:30", sender: "other" },
  { id: "2", text: "I’m good, what about you?", time: "17:31", sender: "me" },
  { id: "3", text: "Let’s catch up later 😄", time: "17:32", sender: "other" },
];

export default function ChatArea() {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      {messages.map((msg, i) => (
        <Card msg={msg} />
      ))}
    </div>
  );
}
