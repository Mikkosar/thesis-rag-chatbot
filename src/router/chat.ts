import express, { Request, Response } from "express";
import "dotenv/config";
import { getChatCompeletion } from "../services/chat";
import { ChatMessages, AssistantMessage } from "../types/chatTypes";
import {
  createUIMessageStream,
  pipeUIMessageStreamToResponse,
  TextPart,
  UIMessage,
} from "ai"; // jos ai-kirjasto exportoi tämän
import ChatLog from "../models/chatLog";
import User from "../models/user";
import { optionalVerifyToken } from "@/middleware/auth";
import { getStreamText } from "@/services/streamChat";

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

    const response = await getChatCompeletion(messages);

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

    return res.json({ assistantResponse });
  } catch (error) {
    console.error("Error processing chat:", error);
    return res.status(500).json({ error: "Internal server error" });
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
      }: { messages: UIMessage[]; chatLogId?: string } = req.body;

      pipeUIMessageStreamToResponse({
        response: res,
        stream: createUIMessageStream<MyUIMessage>({
          execute: async ({ writer }) => {
            let finalChatLogId = chatLogId;

            if (req.user) {
              const userId = req.user.id;

              if (finalChatLogId) {
                // Käyttäjä + olemassa oleva logi → pusketaan uusi viesti
                const lastUserMessage = messages[messages.length - 1];
                await ChatLog.findByIdAndUpdate(finalChatLogId, {
                  $push: { messages: lastUserMessage },
                });
              } else {
                // Käyttäjä + ei logia → luodaan uusi
                const newChatLog = new ChatLog({
                  messages, // sisältää käyttäjän kysymyksen
                  userId,
                });
                await newChatLog.save();

                await User.findByIdAndUpdate(userId, {
                  $push: { chatLogs: newChatLog.id },
                });

                finalChatLogId = newChatLog.id;

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

            if (req.user && finalChatLogId) {
              const assistantResponse: UIMessage = {
                id: crypto.randomUUID(),
                role: "assistant",
                parts: [{ type: "text", text: fullText }],
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
