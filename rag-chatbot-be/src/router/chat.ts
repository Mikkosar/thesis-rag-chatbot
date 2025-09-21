import express, { NextFunction, Request, Response } from "express";
import "dotenv/config";
import {
  createUIMessageStream,
  pipeUIMessageStreamToResponse,
  UIMessage,
} from "ai";
import { optionalVerifyToken } from "@/middleware/auth";
import { getStreamText } from "@/services/stream-chat/stream-chat";

import type { IChatMessages } from "@/types/chat-log-types";
import { assert } from "@/utils/assert";
import saveChatLog from "@/services/generate-chat/save-chat-log";
import getModelResponse from "@/services/generate-chat/get-model-response";
import formattedMessagesForDB from "@/services/stream-chat/formatted-message-for-db";
import createOrUpdateChatLog from "@/services/stream-chat/update-or-create-log";
import updateLogWithAssistantMessage from "@/services/stream-chat/update-log";
import { MessageStream } from "@/types/message-stream";

const router = express.Router();

router.post(
  "/",
  optionalVerifyToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        messages,
        chatLogId,
      }: { messages: IChatMessages; chatLogId: string } = req.body;

      // Tarkistetaan, että viestit on annettu
      assert(messages && messages.length > 0, 400, "Messages are required");

      // Luodaan globaali muuttuja finalChatLogId, jota voidaan muokata
      let finalChatLogId = chatLogId || undefined;

      // Haetaan mallin vastaus
      const assistantResponse = await getModelResponse(messages);
      assert(res, 500, "Failed to get response from AI");

      // Tallennetaan chatlogi, jos käyttäjä on kirjautunut
      if (req.user) {
        finalChatLogId = await saveChatLog(
          chatLogId,
          req.user.id,
          messages,
          assistantResponse
        );
      }

      // Palautetaan vastaus ja chatLogId (jos olemassa tai luotu)
      return res.json({
        messages: assistantResponse,
        chatLogId: finalChatLogId,
      });
    } catch (error) {
      return next(error);
    }
  }
);

router.post(
  "/stream",
  optionalVerifyToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        messages,
        chatLogId,
      }: { messages: UIMessage[]; chatLogId: string } = req.body;

      assert(messages && messages.length > 0, 400, "Messages are required");

      // Muutetaan UIMessage-muoto chatLogiin tallennettavaksi muodoksi
      const { formattedMessages, formattedLastMessage } =
        formattedMessagesForDB(messages);
      console.log("Last user message:", formattedLastMessage);

      // Streamataan vastaus
      pipeUIMessageStreamToResponse({
        response: res,
        stream: createUIMessageStream<MessageStream>({
          execute: async ({ writer }) => {
            // Globaali muuttuja, jota voidaan muokata
            let finalChatLogId = chatLogId;

            // Jos käyttäjä on kirjautunut, luodaan tai päivitetään chatLogia
            if (req.user) {
              finalChatLogId = await createOrUpdateChatLog(
                req.user ? req.user.id : "",
                finalChatLogId,
                formattedMessages,
                formattedLastMessage
              );
            }

            // Lähetetään chatLogId clientille
            writer.write({
              type: "data-chatLogId",
              data: { chatLogId: finalChatLogId },
            });

            // Streamataan vastaus kaikissa tapauksissa
            const stream = await getStreamText(messages);
            writer.merge(stream.toUIMessageStream({ sendStart: false }));

            if (req.user && finalChatLogId) {
              let fullText = "";
              for await (const textPart of stream.textStream) {
                fullText += textPart;
              }
              await updateLogWithAssistantMessage(finalChatLogId, fullText);
            }
          },
        }),
      });
    } catch (error) {
      console.error("Error processing chat:", error);
      next(error);
    }
  }
);

export default router;
