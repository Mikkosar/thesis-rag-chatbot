export type Role = "user" | "assistant";

export interface IMessage {
  id: string | undefined;
  role: Role;
  content: string;
}

export type Message = IMessage;
export type MessageList = Message[];
