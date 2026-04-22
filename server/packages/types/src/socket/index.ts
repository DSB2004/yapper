export interface ONLINE_SOCKET_PAYLOAD {
  userId: string;
}

export interface OFFLINE_SOCKET_PAYLOAD {
  userId: string;
}

interface _SOCKET_PAYLOAD {
  userId: string;
  chatroomId: string;
}

export interface JOIN_SOCKET_PAYLOAD extends _SOCKET_PAYLOAD {}
export interface LEAVECHAT_SOCKET_PAYLOAD extends _SOCKET_PAYLOAD {}
export interface TYPING_SOCKET_PAYLOAD extends _SOCKET_PAYLOAD {}
export interface STOP_TYPING_SOCKET_PAYLOAD extends _SOCKET_PAYLOAD {}

export interface ADD_SOCKET_PAYLOAD extends _SOCKET_PAYLOAD {}
export interface REMOVE_SOCKET_PAYLOAD extends _SOCKET_PAYLOAD {}
export interface LEAVE_SOCKET_PAYLOAD extends _SOCKET_PAYLOAD {}
export interface UPDATE_SOCKET_PAYLOAD extends _SOCKET_PAYLOAD {
  chatroom: {
    name: string;
    description: string;
    icon: string;
  };
}
export interface MAKE_ADMIN_SOCKET_PAYLOAD extends _SOCKET_PAYLOAD {}
export interface REMOVE_ADMIN_SOCKET_PAYLOAD extends _SOCKET_PAYLOAD {}

export const SOCKET_EVENTS = {
  COMMON: {
    ONLINE: "socket.common.online",
    OFFLINE: "socket.common.offline",
    TYPING: "socket.common.typing",
    STOP_TYPING: "socket.common.stop-typing",
    DETAILS: "socket.common.connection-details",
    JOIN: "socket.common.join",
    LEAVE: "socket.common.leave",
    NEW_CHATROOM: "socket.common.new-chatroom",
    ONLINE_CLIENT: "socket.common.online.client",
    OFFLINE_CLIENT: "socket.common.offline.client",
    TYPING_CLIENT: "socket.common.typing.client",
    STOP_TYPING_CLIENT: "socket.common.stop-typing.client",
    DETAILS_CLIENT: "socket.common.connection-details.client",
    JOIN_CLIENT: "socket.common.join.client",
    LEAVE_CLIENT: "socket.common.leave.client",
    NEW_CHATROOM_CLIENT: "socket.common.new-chatroom.client",
  },
  CONTACT: {
    BLOCK: "socket.chat.block",
    UNBLOCK: "socket.chat.unblock",
    BLOCK_CLIENT: "socket.chat.block.client",
    UNBLOCK_CLIENT: "socket.chat.unblock.client",
  },
  GROUP: {
    ADD: "socket.group.add",
    REMOVE: "socket.group.remove",
    LEAVE: "socket.group.leave",
    UPDATE: "socket.group.update",
    MAKE_ADMIN: "socket.group.make-admin",
    REMOVE_ADMIN: "socket.group.remove-admin",

    ADD_CLIENT: "socket.group.add.client",
    REMOVE_CLIENT: "socket.group.remove.client",
    LEAVE_CLIENT: "socket.group.leave.client",
    UPDATE_CLIENT: "socket.group.update.client",
    MAKE_ADMIN_CLIENT: "socket.group.make-admin.client",
    REMOVE_ADMIN_CLIENT: "socket.group.remove-admin.client",
  },
  MESSAGE: {
    ADD: "socket.message.add",
    UPDATE: "socket.message.update",
    DELETE: "socket.message.delete",
    STAR: "socket.message.star",
    PIN: "socket.message.pin",
    REACTION: "socket.message.reaction",
    SEEN: "socket.message.seen",
    RECEIVED: "socket.message.received",

    ADD_CLIENT: "socket.message.add.client",
    UPDATE_CLIENT: "socket.message.update.client",
    DELETE_CLIENT: "socket.message.delete.client",
    STAR_CLIENT: "socket.message.star.client",
    PIN_CLIENT: "socket.message.pin.client",
    REACTION_CLIENT: "socket.message.reaction.client",
    SEEN_CLIENT: "socket.message.seen.client",
    RECEIVED_CLIENT: "socket.message.received.client",
  },
} as const;
export interface MessageAttachment {
  url: string;
  filename: string;
  filesize: number;
}
export interface MessagePayload {
  publicId: string;
  type: "GENERAL" | "INFO";
  attachments: MessageAttachment[];
  text: string;
  for: string[];
  isReply: boolean;
  replyFor?: string;
  isForwarded: boolean;
}
export interface DETAILS_SOCKET_PAYLOAD {
  onlineUsers: string[];
  inChat: {
    [k: string]: string[];
  };
}
export interface ADD_MESSAGE_SOCKET_PAYLOAD {
  message: MessagePayload;
  chatroomId: string;
  by: string;
  createdAt: Date;
}
interface MESSAGE_SOCKET_PAYLOAD {
  chatroomId: string;
  messageId: string;
}
export interface UPDATE_MESSAGE_SOCKET_PAYLOAD extends MESSAGE_SOCKET_PAYLOAD {
  message: {
    text: string;
  };
}

export interface DELETE_MESSAGE_SOCKET_PAYLOAD extends MESSAGE_SOCKET_PAYLOAD {}
export interface PINNED_MESSAGE_SOCKET_PAYLOAD extends MESSAGE_SOCKET_PAYLOAD {
  for: string[];
  pinnedBy: string;
}
export interface STARRED_MESSAGE_SOCKET_PAYLOAD extends MESSAGE_SOCKET_PAYLOAD {}

export interface REACTION_MESSAGE_SOCKET_PAYLOAD extends MESSAGE_SOCKET_PAYLOAD {
  reactionBy: string;
  reaction: string;
}

export interface SEEN_MESSAGE_SOCKET_PAYLOAD extends MESSAGE_SOCKET_PAYLOAD {
  seenBy: string;
}

export interface RECEIVED_MESSAGE_SOCKET_PAYLOAD extends MESSAGE_SOCKET_PAYLOAD {
  receivedBy: string;
}
