export interface MessageAttachment {
  url: string;
  filename: string;
  filesize: number;
}

export interface MessageReaction {
  reaction: string;
  userId: string;
}

export enum MessageType {
  GENERAL = "GENERAL",
  INFO = "INFO",
  UNRECOGNIZED = -1,
}

export interface Message {
  publicId: string;
  type: MessageType;
  attachments: MessageAttachment[];
  text?: string | undefined;
  seen: string[];
  received: string[];
  isUpdated: boolean;
  isStarred: boolean;
  isPinned: boolean;
  isDeleted: boolean;
  chatroomId: string;
  createdAt: string;
  updatedAt: string;
  by: string;
  for: string[];
  reactions: MessageReaction[];
  isForwarded: boolean;
  isReply: boolean;
  replyFor?: string | undefined;
}

export enum InfoEvent {
  BLOCK = "BLOCK",
  UNBLOCK = "UNBLOCK",
  UNPINNED = "UNPINNED",
  PINNED = "PINNED",
}
