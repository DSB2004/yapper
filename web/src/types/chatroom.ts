export interface UserDetails {
  userId: string;
  name: string;
  avatar: string;
}

export interface Chatroom {
  chatroomId: string;
  referenceId: string;
  type: string;
  isActive: boolean;
  createdBy: UserDetails;
  name?: string;
  icon?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  participants: UserDetails[];
  lastMessage?: {
    publicId: string;
    text: string;
    by: string;
    createdAt: string;
    previewText: string;
  };
}
