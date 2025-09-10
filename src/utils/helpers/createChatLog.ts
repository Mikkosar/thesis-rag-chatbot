import ChatLog from "@/models/chatLog";
import User from "@/models/user";
import { IChatMessage } from "@/types/chatLogTypes";
import { assert } from "../assert";

const createChatLog = async (
  userId: string,
  formattedMessages: IChatMessage[]
): Promise<string> => {
  // Luo uusi chat-loki ja liitä se käyttäjään
  const newChatLog = new ChatLog({
    messages: formattedMessages,
    userId,
  });
  const newLog = await newChatLog.save();
  assert(newLog, 500, "Failed to create new chat log");

  const updated = await User.findByIdAndUpdate(
    userId,
    { $push: { chatLogs: newChatLog.id } },
    { new: true }
  );
  assert(updated, 404, "User not found when updating chat logs");

  return newChatLog.id;
};

export default createChatLog;
