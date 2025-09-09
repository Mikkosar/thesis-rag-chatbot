import ChatLog from "@/models/chatLog";
import User from "@/models/user";
import { IChatMessage, IChatMessages } from "@/types/chatLogTypes";
import { assert } from "@/utils/assert";

const saveChatLog = async (
  chatLogId: string | undefined,
  userId: string,
  messages: IChatMessages,
  assistantResponse: IChatMessage
) => {
  if (chatLogId) {
    const newQueryAndResponse: IChatMessages = [
      messages[messages.length - 1],
      assistantResponse,
    ];
    const updatedLog = await ChatLog.findByIdAndUpdate(
      chatLogId,
      { $push: { messages: newQueryAndResponse } },
      { new: true }
    );
    assert(updatedLog, 404, "Chat log not found");
    return chatLogId;
  }

  const newChatLog = new ChatLog({
    messages: [...messages, assistantResponse],
    userId,
  });
  const newLog = await newChatLog.save();
  assert(newLog, 500, "Failed to create new chat log");

  const updatedUserChatLogs = await User.findByIdAndUpdate(userId, {
    $push: { chatLogs: newLog.id },
  });
  
  assert(updatedUserChatLogs, 404, "User not found");

  return newLog.id;
};

export default saveChatLog;