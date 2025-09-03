export interface IMessagePart {
  type: "text";
  text: string;
}

export interface IMessage {
  id: string;
  role: "user" | "assistant" | "system";
  metadata?: Record<string, any> | undefined;
  parts: IMessagePart[];
}

export type NewChatMessages = IMessage[];
export type NewChatMessage = IMessage;
