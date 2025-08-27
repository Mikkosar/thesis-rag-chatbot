import express from "express";
import { getChatCompeletion } from "../services/chat";
import { ChatMessages, AssistantMessage } from "../types/chatTypes";
import { TextPart } from "ai"; // jos ai-kirjasto exportoi tämän

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const messages: ChatMessages = req.body.messages;

    if (!messages) {
      return res.status(400).json({ error: "Query is required" });
    }

    const MAX_HISTORY = 4;
    const recentMessages = messages.slice(-MAX_HISTORY);

    const response = await getChatCompeletion(recentMessages);

    const answer = response.steps[1]
      ? (response.steps[1].content[0] as TextPart).text // toolia käytetty
      : (response.steps[0].content[0] as TextPart).text; // toolia ei käytetty

    const assistantResponse: AssistantMessage = {
      role: "assistant",
      content: answer,
    };

    const updatedMessages: ChatMessages = [...messages, assistantResponse];

    return res.json({ messages: updatedMessages });
  } catch (error) {
    console.error("Error processing chat:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
