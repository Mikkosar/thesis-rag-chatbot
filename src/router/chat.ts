import express, { Request, Response } from "express";
import { getChatCompeletion } from "../services/chat";
import { ChatMessages, AssistantMessage } from "../types/chatTypes";
import { TextPart } from "ai"; // jos ai-kirjasto exportoi tämän
import ChatLog from "../models/chatLog";
import User from "../models/user";
import { optionalVerifyToken } from "@/middleware/auth";

const router = express.Router();

router.post("/", optionalVerifyToken, async (req: Request, res: Response) => {
  try {
    const {
      messages,
      chatLogId,
    }: { messages: ChatMessages; chatLogId: string } = req.body;

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

    if (req.user) {
      const userId = req.user.id;
      if (chatLogId) {
        const newQueryAndResponse = [
          messages[messages.length - 1],
          assistantResponse,
        ];

        await ChatLog.findByIdAndUpdate(
          chatLogId,
          { $push: { messages: newQueryAndResponse } },
          { new: true }
        );
        return res.json({ messages: updatedMessages, chatLogId });
      } else {
        const newChatLog = new ChatLog({
          messages: updatedMessages,
          userId: userId,
        });
        await newChatLog.save();
        await User.findByIdAndUpdate(userId, {
          $push: { chatLogs: newChatLog.id },
        });
        return res.json({
          messages: updatedMessages,
          chatLogId: newChatLog.id,
        });
      }
    }

    return res.json({ messages: updatedMessages });
  } catch (error) {
    console.error("Error processing chat:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
