import ChatLog from "@/models/chatLog";
import { IMessage } from "@/types/chatLogTypes";
import { assert } from "@/utils/assert";

const updateLogWithAssistantMessage = async (
  finalChatLogId: string,
  fullText: string
): Promise<void> => {
  const assistantResponse: IMessage = {
    id: undefined as any,
    role: "assistant",
    content: fullText,
  };

  const result = await ChatLog.findByIdAndUpdate(
    finalChatLogId,
    {
      $push: { messages: assistantResponse },
    },
    { new: true }
  );
  assert(result, 404, "Chat log not found");
};

export default updateLogWithAssistantMessage;
