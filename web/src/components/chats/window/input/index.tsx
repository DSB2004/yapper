"use client";
import { useInput } from "./provider";
import Text from "./text";
import { InputProvider } from "./provider";
import Reply from "./reply";
import Emoji from "./emoji";
import Attachment from "./attachment";
import AttachmentPreview from "./attachment-preview";
export default function ChatInput() {
  return (
    <InputProvider>
      <AttachmentPreview></AttachmentPreview>
      <div className="border-t  ">
        <Reply></Reply>
        <div className="flex gap-2 px-3 ">
          <Attachment></Attachment>

          <Emoji></Emoji>
          <Text />
        </div>
      </div>
    </InputProvider>
  );
}
