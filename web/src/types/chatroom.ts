export interface UserDetails {
  userId: string;
  name: string;
  avatar: string;
}
interface LastMessage {
  publicId: string;
  text: string;
  by: string;
  createdAt: string;
  previewText: string;
}
export interface Chatroom {
  chatroomId: string;
  referenceId: string;
  type: string;
  createdBy: UserDetails;
  name?: string;
  icon?: string;
  description?: string;
  createdAt: string;
  participants: UserDetails[];
  unreadCount: number;
  lastMessage?: LastMessage;
  isBlocked: boolean;
  areYouBlocked: boolean;
}
