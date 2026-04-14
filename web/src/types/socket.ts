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
  type: "GENERAL" | "INFO";
  attachments: MessageAttachment[];
  text: string;
}

interface MESSAGE_SOCKET_PAYLOAD {
  chatroomId: string;
  messageId: string;
}
export interface ADD_MESSAGE_SOCKET_PAYLOAD extends MESSAGE_SOCKET_PAYLOAD {
  message: MessagePayload;
  by: string;
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

export interface DETAILS_SOCKET_PAYLOAD {
  onlineUsers: string[];
  inChat: {
    [k: string]: string[];
  };
}
