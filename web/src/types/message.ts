export interface MessageAttachment {
  url: string;
  filename: string;
  filesize: number;
}

export enum MessageType {
  GENERAL = 0,
  INFO = 1,
  UNRECOGNIZED = -1,
}

export interface Message {
  publicId: string;
  type: MessageType;
  reactions: {}[];
  attachments: MessageAttachment[];
  text?: string | undefined;
  seen: string[];
  received: string[];
  isUpdated: boolean;
  isStarred: boolean;
  isPinned: boolean;
  chatroomId: string;
  createdAt: string;
  updatedAt: string;
  by: string;
}
