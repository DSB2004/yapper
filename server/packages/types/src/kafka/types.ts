interface UPDATE_GROUP_KAKA_PAYLOAD {
  chatroom: string;
  event: string;
  payload: string;
}

interface BLOCK_STATUS_UPDATE {
  contactId: string;
  userId: string;
  chatroomId: string;
}

export { UPDATE_GROUP_KAKA_PAYLOAD, BLOCK_STATUS_UPDATE };
