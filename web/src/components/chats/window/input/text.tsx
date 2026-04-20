import React from "react";
import { useInput } from "./provider";
import { Send } from "lucide-react";

export default function Text() {
  const { text, handleChange, handleSubmit } = useInput();

  return (
    <div className="py-3 flex-1 flex items-center gap-2">
      <input
        value={text}
        onChange={handleChange}
        placeholder="Type a message..."
        className="flex-1 border rounded-full px-4 py-2 text-sm outline-none"
      />

      <button
        className="bg-primary text-white p-2 rounded-full"
        onClick={() => {
          handleSubmit();
        }}
      >
        <Send className="size-5 stroke-1.5" ></Send>
      </button>
    </div>
  );
}
