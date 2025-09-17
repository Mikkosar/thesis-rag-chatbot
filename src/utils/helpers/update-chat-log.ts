import ChatLog from "@/models/chat-log";
import { IChatMessage } from "@/types/chat-log-types";
import { assert } from "../assert";

const updateChatLog = async (
  finalChatLogId: string,
  formattedLastMessage: IChatMessage
): Promise<void> => {
  // Päivitä chat-loki uudella käyttäjän viestillä
  const updated = await ChatLog.findByIdAndUpdate(
    finalChatLogId,
    { $push: { messages: formattedLastMessage } },
    { new: true }
  );
  assert(updated, 404, "Chat log not found");
};

export default updateChatLog;
