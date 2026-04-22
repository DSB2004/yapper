export const KAFKA_EVENTS = {
  MESSAGE: {
    ADD: "kafka.message.add",
    UPDATE: "kafka.message.update",
    DELETE: "kafka.message.delete",
    STAR: "kafka.message.star",
    PIN: "kafka.message.pin",
    REACTION: "kafka.message.reaction",
    SEEN: "kafka.message.seen",
    RECEIVED: "kafka.message.received",
  },
  GROUP: {
    GROUP_UPDATE: "kafka.group.update",
  },
  CONTACT: {
    BLOCK: "kafka.contact.block",
    UNBLOCK: "kafka.contact.unblock",
  },
};
