import express, { NextFunction, Request, Response } from "express";
import "dotenv/config";
import { getChatCompeletion } from "../services/GenerateChat/chat";
import {
  createUIMessageStream,
  pipeUIMessageStreamToResponse,
  UIMessage,
} from "ai";
import ChatLog from "../models/chatLog";
import User from "../models/user";
import { optionalVerifyToken } from "@/middleware/auth";
import { getStreamText } from "@/services/streamChat";

import type { IChatMessage, IChatMessages, IMessage } from "@/types/chatLogTypes";
import { assert } from "@/utils/assert";
import saveChatLog from "@/services/GenerateChat/saveChatLog";

const router = express.Router();

export const getModelResponse = async (messages: IChatMessages, next: NextFunction) => {
  const response = await getChatCompeletion(messages);

      if (!response) {
      next(new Error("Something went wrong with the AI response"));
    }

    const assistantResponse: IChatMessage = {
      id: undefined as any,
      role: "assistant",
      content: response.text,
    };

    const updatedMessages = [...messages, assistantResponse];

    return { assistantResponse, updatedMessages };
}

router.post("/", optionalVerifyToken, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      messages,
      chatLogId,
    }: { messages: IChatMessages; chatLogId: string } = req.body;

    let finalChatLogId = chatLogId;
    assert(messages && messages.length > 0, 400, "Messages are required");

    const response = await getChatCompeletion(messages);
    assert(response, 500, "Failed to get response from AI");

    const assistantResponse: IChatMessage = {
      id: undefined as any,
      role: "assistant",
      content: response.text,
    };

 
    if (req.user) {
      finalChatLogId = await saveChatLog(chatLogId, req.user.id, messages, assistantResponse);
    }

    return res.json({ messages: assistantResponse, chatLogId: finalChatLogId });
  } catch (error) {
    return next(error);
  }
});

export type MyUIMessage = UIMessage<
  never,
  {
    chatLogId: {
      chatLogId: string | undefined;
    };
  }
>;

router.post(
  "/stream",
  optionalVerifyToken,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        messages,
        chatLogId,
      }: { messages: UIMessage[]; chatLogId: string } = req.body;

      console.log(chatLogId)

      const lastUserMessage: IChatMessage = {
        id: undefined as any,
        role: "user",
        content: messages[messages.length - 1].parts
          .map((part) => (part.type === "text" ? part.text : ""))
          .join(""),
      };

      const formattedMessages: IChatMessages = messages.map((msg) => ({
        id: undefined as any,
        role: msg.role,
        content: msg.parts.map((part) => (part.type === "text" ? part.text : "")).join(""),
      }));

      console.log("Last user message:", lastUserMessage);

      pipeUIMessageStreamToResponse({
        response: res,
        stream: createUIMessageStream<MyUIMessage>({
          execute: async ({ writer }) => {
            let finalChatLogId = chatLogId;
            if (req.user) {
              const userId = req.user.id;

              if (finalChatLogId) {
                console.log("Using existing chatLogId:", finalChatLogId);
                // Käyttäjä + olemassa oleva logi → pusketaan uusi viesti
                await ChatLog.findByIdAndUpdate(finalChatLogId, {
                  $push: { messages: lastUserMessage },
                });
              } else {
                // Käyttäjä + ei logia → luodaan uusi
                console.log("Creating new chat log for user");
                const newChatLog = new ChatLog({
                  messages: formattedMessages, // sisältää käyttäjän kysymyksen
                  userId,
                });
                await newChatLog.save();

                await User.findByIdAndUpdate(userId, {
                  $push: { chatLogs: newChatLog.id },
                });

                finalChatLogId = newChatLog.id;
                console.log("Created new chatLogId:", finalChatLogId);

                // Lähetetään id streamin mukana fronttiin
                writer.write({
                  type: "data-chatLogId",
                  data: { chatLogId: finalChatLogId },
                });
              }
            }

            // Streamataan vastaus kaikissa tapauksissa
            const stream = await getStreamText(messages);
            writer.merge(stream.toUIMessageStream({ sendStart: false }));

            let fullText = "";
            for await (const textPart of stream.textStream) {
              fullText += textPart;
            }

            console.log("tallennetaan chatlogiin:", finalChatLogId);

            if (req.user && finalChatLogId) {
              const assistantResponse: IMessage = {
                id: undefined as any,
                role: "assistant",
                content: fullText,
              };

              await ChatLog.findByIdAndUpdate(finalChatLogId, {
                $push: { messages: assistantResponse },
              });
            }
          },
        }),
      });
    } catch (error) {
      console.error("Error processing chat:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default router;
