import { UIMessage } from "ai";

// Viestivirran tyyppi, joka sisältää chatLogId:n metatiedoissa
export type MessageStream = UIMessage<
  never,
  {
    chatLogId: {
      chatLogId: string | undefined;
    };
  }
>;
