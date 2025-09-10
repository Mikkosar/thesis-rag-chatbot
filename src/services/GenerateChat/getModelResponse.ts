import { IChatMessage, IChatMessages } from "@/types/chatLogTypes";
import { assert } from "@/utils/assert";
import { getChatCompeletion } from "./chat";

const getModelResponse = async (messages: IChatMessages) => {
  // Haetaan mallin vastaus
  const response = await getChatCompeletion(messages);
  assert(response, 500, "Failed to get response from AI");

  // Formatoidaan vastaus IChatMessage-muotoon
  const assistantResponse: IChatMessage = {
    id: undefined as any,
    role: "assistant",
    content: response.text,
  };

  return assistantResponse;
};

export default getModelResponse;
