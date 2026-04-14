import { useQueryClient } from "@tanstack/react-query";
import { Chatroom } from "@/types/chatroom";

interface LastMessagePayload {
  chatroomId?: string;
  referenceId?: string;
  lastMessage: any;
}

export const useChatroom = () => {
  const queryClient = useQueryClient();

  const addChatroom = (newChatroom: Chatroom) => {
    queryClient.setQueryData<Chatroom[]>(["chatrooms"], (old) => {
      if (!old) return [newChatroom];

      const filtered = old.filter(
        (c) => c.chatroomId !== newChatroom.chatroomId,
      );

      return [newChatroom, ...filtered];
    });
  };

  const removeChatroom = (chatroomId: string) => {
    queryClient.setQueryData<Chatroom[]>(["chatrooms"], (old) => {
      if (!old) return [];
      return old.filter((c) => c.chatroomId !== chatroomId);
    });
  };

  const updateLastMessage = ({
    chatroomId,
    referenceId,
    lastMessage,
  }: LastMessagePayload) => {
    queryClient.setQueryData<Chatroom[]>(["chatrooms"], (old) => {
      if (!old) return old;

      let target: Chatroom | undefined;

      if (chatroomId) {
        target = old.find((c) => c.chatroomId === chatroomId);
      }


      if (!target && referenceId) {
        target = old.find((c: any) => c.referenceId === referenceId);
      }

      if (!target) return old;

      const updated: Chatroom = {
        ...target,
        lastMessage,
      };

      const rest = old.filter((c) => c.chatroomId !== target!.chatroomId);

      return [updated, ...rest];
    });
  };

  return {
    addChatroom,
    removeChatroom,
    updateLastMessage,
  };
};
