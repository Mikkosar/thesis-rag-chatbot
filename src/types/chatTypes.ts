export interface UserMessage {
  role: "user";
  content: string;
}

export interface systemMessage {
  role: "system";
  content: string;
}

export interface AssistantMessage {
  role: "assistant";
  content: string;
}

export type ChatMessage = UserMessage | systemMessage | AssistantMessage;

export type ChatMessages = ChatMessage[];
