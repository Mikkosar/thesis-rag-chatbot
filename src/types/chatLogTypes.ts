// Chat-viestien tyypit
export interface IMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
}

export type IChatMessages = IMessage[];
export type IChatMessage = IMessage;
