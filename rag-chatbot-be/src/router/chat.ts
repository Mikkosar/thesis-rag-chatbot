/**
 * Chat Router
 * 
 * This module handles chat functionality for the RAG chatbot system, providing
 * both streaming and non-streaming chat endpoints. It integrates with the AI
 * model to generate responses and manages chat log persistence for authenticated users.
 * 
 * Endpoints:
 * - POST /api/chat - Non-streaming chat with AI model
 * - POST /api/chat/stream - Real-time streaming chat with AI model
 * 
 * Both endpoints support optional authentication and automatically save
 * conversation history for authenticated users.
 * 
 * @fileoverview Chat functionality and AI integration API endpoints
 * @author RAG Chatbot Team
 */

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

/**
 * Non-Streaming Chat Endpoint
 * 
 * Processes chat messages and returns a complete AI response. This endpoint
 * is suitable for applications that don't require real-time streaming but
 * want to maintain conversation history for authenticated users.
 * 
 * @route POST /api/chat
 * @param {IChatMessages} messages - Array of chat messages
 * @param {string} [chatLogId] - Optional existing chat log ID to append to
 * @returns {Object} Complete chat response
 * @returns {IChatMessages} messages - AI assistant's response messages
 * @returns {string} [chatLogId] - Chat log ID for conversation persistence
 * 
 * @example
 * // Request body
 * {
 *   "messages": [
 *     {
 *       "role": "user",
 *       "content": "I need help with my studies"
 *     }
 *   ],
 *   "chatLogId": "optional-existing-log-id"
 * }
 * 
 * // Response
 * {
 *   "messages": [
 *     {
 *       "role": "assistant",
 *       "content": "I'd be happy to help you with your studies..."
 *     }
 *   ],
 *   "chatLogId": "new-or-existing-log-id"
 * }
 */
router.post(
  "/",
  optionalVerifyToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        messages,
        chatLogId,
      }: { messages: IChatMessages; chatLogId: string } = req.body;

      // Validate that messages are provided
      assert(messages && messages.length > 0, 400, "Messages are required");

      // Initialize chat log ID variable that can be modified
      let finalChatLogId = chatLogId || undefined;

      // Get AI model response
      const assistantResponse = await getModelResponse(messages);
      assert(res, 500, "Failed to get response from AI");

      // Save chat log if user is authenticated
      if (req.user) {
        finalChatLogId = await saveChatLog(
          chatLogId,
          req.user.id,
          messages,
          assistantResponse
        );
      }

      // Return response and chat log ID (if exists or created)
      return res.json({
        messages: assistantResponse,
        chatLogId: finalChatLogId,
      });
    } catch (error) {
      return next(error);
    }
  }
);

/**
 * Streaming Chat Endpoint
 * 
 * Provides real-time streaming chat functionality using the AI SDK's streaming
 * capabilities. This endpoint streams the AI response as it's generated, providing
 * a more interactive user experience. Chat logs are automatically managed for
 * authenticated users.
 * 
 * @route POST /api/chat/stream
 * @param {UIMessage[]} messages - Array of UI-formatted chat messages
 * @param {string} [chatLogId] - Optional existing chat log ID to append to
 * @returns {Stream} Real-time streaming response with AI-generated content
 * 
 * @example
 * // Request body
 * {
 *   "messages": [
 *     {
 *       "role": "user",
 *       "id": "1",
 *       "parts": [
 *         {
 *           "type": "text",
 *           "text": "I need help with my studies"
 *         }
 *       ]
 *     }
 *   ],
 *   "chatLogId": "optional-existing-log-id"
 * }
 * 
 * // Response: Stream of data chunks containing AI response
 * // Use AI SDK's useChat hook in frontend to handle streaming
 */
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

      // Convert UIMessage format to database-storable format
      const { formattedMessages, formattedLastMessage } =
        formattedMessagesForDB(messages);
      console.log("Last user message:", formattedLastMessage);

      // Stream the response using AI SDK
      pipeUIMessageStreamToResponse({
        response: res,
        stream: createUIMessageStream<MessageStream>({
          execute: async ({ writer }) => {
            // Global variable that can be modified
            let finalChatLogId = chatLogId;

            // If user is authenticated, create or update chat log
            if (req.user) {
              finalChatLogId = await createOrUpdateChatLog(
                req.user ? req.user.id : "",
                finalChatLogId,
                formattedMessages,
                formattedLastMessage
              );
            }

            // Send chat log ID to client
            writer.write({
              type: "data-chatLogId",
              data: { chatLogId: finalChatLogId },
            });

            // Stream response in all cases
            const stream = await getStreamText(messages);
            writer.merge(stream.toUIMessageStream({ sendStart: false }));

            // Update chat log with full assistant response for authenticated users
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
