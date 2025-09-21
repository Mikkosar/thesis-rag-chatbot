import { IChatMessage } from "@/types/chat-log-types";
import createChatLog from "@/utils/helpers/create-chat-log";
import updateChatLog from "@/utils/helpers/update-chat-log";

export const createOrUpdateChatLog = async (
  userId: string,
  finalChatLogId: string,
  formattedMessages: IChatMessage[],
  formattedLastMessage: IChatMessage
): Promise<string> => {
  if (finalChatLogId) {
    // Käyttäjä + olemassa oleva logi → pusketaan uusi viesti
    await updateChatLog(finalChatLogId, formattedLastMessage);
  } else {
    // Käyttäjä + ei logia → luodaan uusi
    finalChatLogId = await createChatLog(userId, formattedMessages);
  }
  return finalChatLogId;
};

export default createOrUpdateChatLog;
