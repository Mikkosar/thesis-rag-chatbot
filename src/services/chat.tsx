import axios from "axios";
import type { MessageList, Message } from "../types/chat";

const baseURL = import.meta.env.VITE_BASE_URL;

const sendMessage = async (messages: MessageList) => {
  console.log("messages in service:", messages[0]);
  try {
    const response = await axios.post(
      `${baseURL}/chat`,
      { messages, chatLogId: "68bd9d819d72f8682c6c4c6c" },
      {
        headers: {
          //Authorization: `Bearer `
        },
      }
    );
    if (response.status !== 200) {
      throw new Error("Failed to send message");
    }
    console.log("Response from API:", response.data);
    return response.data.messages as Message;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

export default { sendMessage };
