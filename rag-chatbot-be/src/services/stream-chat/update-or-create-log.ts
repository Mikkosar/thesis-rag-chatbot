/**
 * Chat Log Management Service for Streaming Chat
 * 
 * This module provides intelligent chat log management for the streaming chat system.
 * It handles both creating new chat logs and updating existing ones based on whether
 * a chat log ID is provided, ensuring proper conversation persistence for streaming
 * chat sessions.
 * 
 * The service implements conditional logic that determines whether to:
 * - Update an existing chat log by appending new messages
 * - Create a new chat log for new conversations
 * 
 * This approach provides a unified interface for chat log management in streaming
 * scenarios, handling both new conversations and ongoing chat sessions seamlessly.
 * 
 * Key responsibilities:
 * - Conditional chat log creation or update
 * - User-chat log relationship management
 * - Message persistence for streaming chat
 * - Unified interface for chat log operations
 * 
 * @fileoverview Intelligent chat log management service for streaming chat
 */

import { IChatMessage } from "@/types/chat-log-types";
import createChatLog from "@/utils/helpers/create-chat-log";
import updateChatLog from "@/utils/helpers/update-chat-log";

/**
 * Creates a new chat log or updates an existing one based on provided chat log ID
 * 
 * This function implements intelligent chat log management by determining whether
 * to create a new chat log or update an existing one based on the presence of
 * a chat log ID. This provides a unified interface for handling both new
 * conversations and ongoing chat sessions in the streaming chat system.
 * 
 * The decision logic:
 * - If finalChatLogId is provided: Updates existing chat log with new message
 * - If finalChatLogId is undefined/null: Creates new chat log with all messages
 * - Returns the chat log ID for future reference
 * 
 * @param {string} userId - ID of the user who owns the chat log
 * @param {string} finalChatLogId - Existing chat log ID (if updating) or empty string (if creating new)
 * @param {IChatMessage[]} formattedMessages - All formatted messages for new chat log creation
 * @param {IChatMessage} formattedLastMessage - Last user message for chat log updates
 * @returns {Promise<string>} The chat log ID (existing or newly created)
 * @throws {CustomError} Throws error if chat log operations fail
 */
export const createOrUpdateChatLog = async (
  userId: string,
  finalChatLogId: string,
  formattedMessages: IChatMessage[],
  formattedLastMessage: IChatMessage
): Promise<string> => {
  if (finalChatLogId) {
    // User + existing chat log → append new message to existing log
    await updateChatLog(finalChatLogId, formattedLastMessage);
  } else {
    // User + no chat log → create new chat log with all messages
    finalChatLogId = await createChatLog(userId, formattedMessages);
  }
  return finalChatLogId;
};

export default createOrUpdateChatLog;
