/**
 * Message Stream Type Definitions
 * 
 * This module defines TypeScript types for streaming message functionality
 * in the RAG chatbot system. It extends the AI SDK's UIMessage type to
 * include custom metadata for chat log management.
 * 
 * The MessageStream type enables real-time streaming of chat responses
 * while maintaining chat log persistence for authenticated users.
 * 
 * @fileoverview TypeScript types for streaming chat messages with metadata
 */

import { UIMessage } from "ai";

/**
 * Message Stream Type
 * 
 * Extends the AI SDK's UIMessage type to include custom metadata for
 * chat log management. This type is used in streaming chat endpoints
 * to pass chat log IDs along with the streamed message data.
 * 
 * The metadata includes chatLogId which is used to associate streamed
 * messages with their corresponding chat log in the database.
 * 
 * @type MessageStream
 * 
 * @example
 * // Usage in streaming chat endpoint
 * const messageStream: MessageStream = {
 *   role: "assistant",
 *   id: "msg_123",
 *   parts: [
 *     {
 *       type: "text",
 *       text: "I'd be happy to help you with your studies..."
 *     }
 *   ],
 *   metadata: {
 *     chatLogId: {
 *       chatLogId: "chat_log_456"
 *     }
 *   }
 * };
 */
export type MessageStream = UIMessage<
  never,
  {
    /** Metadata containing chat log information */
    chatLogId: {
      /** The ID of the chat log associated with this message stream */
      chatLogId: string | undefined;
    };
  }
>;
