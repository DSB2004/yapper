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
}
export interface DETAILS_SOCKET_PAYLOAD {
  onlineUsers: string[];
  inChat: {
    [k: string]: string[];
  };
}

export const SOCKET_EVENTS = {
  COMMON: {
    ONLINE: "socket.common.online",
    OFFLINE: "socket.common.offline",
    TYPING: "socket.common.typing",
    STOP_TYPING: "socket.common.stop-typing",
    DETAILS: "socket.common.connection-details",
    JOIN: "socket.common.join",
    LEAVE: "socket.common.leave",

    ONLINE_CLIENT: "socket.common.online",
    OFFLINE_CLIENT: "socket.common.offline",
    TYPING_CLIENT: "socket.common.typing",
    STOP_TYPING_CLIENT: "socket.common.stop-typing",
    DETAILS_CLIENT: "socket.common.connection-details",
    JOIN_CLIENT: "socket.common.join",
    LEAVE_CLIENT: "socket.common.leave",
  },
  GROUP: {
    ADD: "socket.group.add",
    REMOVE: "socket.group.remove",
    LEAVE: "socket.group.leave",
    UPDATE: "socket.group.update",
    MAKE_ADMIN: "socket.group.make-admin",
    REMOVE_ADMIN: "socket.group.remove-admin",

    ADD_CLIENT: "socket.group.add",
    REMOVE_CLIENT: "socket.group.remove",
    LEAVE_CLIENT: "socket.group.leave",
    UPDATE_CLIENT: "socket.group.update",
    MAKE_ADMIN_CLIENT: "socket.group.make-admin",
    REMOVE_ADMIN_CLIENT: "socket.group.remove-admin",
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

    ADD_CLIENT: "socket.message.add",
    UPDATE_CLIENT: "socket.message.update",
    DELETE_CLIENT: "socket.message.delete",
    STAR_CLIENT: "socket.message.star",
    PIN_CLIENT: "socket.message.pin",
    REACTION_CLIENT: "socket.message.reaction",
    SEEN_CLIENT: "socket.message.seen",
    RECEIVED_CLIENT: "socket.message.received",
  },
} as const;

export interface ADD_MESSAGE_SOCKET_PAYLOAD {
  message: MessagePayload;
  chatroomId: string;
  by: string;
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
export interface PINNED_MESSAGE_SOCKET_PAYLOAD extends MESSAGE_SOCKET_PAYLOAD {}
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
