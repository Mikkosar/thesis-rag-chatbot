import { IChatMessage } from "@/types/chat-log-types";
import { UIMessage } from "ai";

const formattedMessagesForDB = (
  messages: UIMessage[]
): {
  formattedMessages: IChatMessage[];
  formattedLastMessage: IChatMessage;
} => {
  // Muunna UIMessage-muotoiset viestit IChatMessage-muotoon
  const formattedMessages = messages.map((msg) => ({
    id: undefined as any,
    role: msg.role as "system" | "user" | "assistant",
    content: msg.parts
      .map((part) => (part.type === "text" ? part.text : ""))
      .join(""),
  }));
  // Muunna Viimeinen viesti käyttäjältä
  const formattedLastMessage = {
    id: undefined as any,
    role: "user" as "user",
    content: messages[messages.length - 1].parts
      .map((part) => (part.type === "text" ? part.text : ""))
      .join(""),
  };
  return { formattedMessages, formattedLastMessage };
};

export default formattedMessagesForDB;
