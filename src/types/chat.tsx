export type Role = "user" | "assistant";

export interface IMessage {
  role: Role;
  content: string;
}

export type Message = IMessage;
export type MessageList = Message[];
