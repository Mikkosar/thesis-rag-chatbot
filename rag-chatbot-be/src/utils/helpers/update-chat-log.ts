/**
 * Update Chat Log Helper Function
 * 
 * This module provides a utility function for updating existing chat logs
 * in the RAG chatbot system. It handles appending new messages to existing
 * chat conversation logs.
 * 
 * The function is used to maintain conversation continuity by adding
 * new messages to existing chat logs rather than creating separate logs
 * for each message exchange.
 * 
 * @fileoverview Utility function for updating existing chat conversation logs
 */

import ChatLog from "@/models/chat-log";
import { IChatMessage } from "@/types/chat-log-types";
import { assert } from "../assert";

/**
 * Updates an existing chat log with a new message
 * 
 * This function appends a new message to an existing chat log's messages array.
 * It's used to maintain conversation continuity when users continue chatting
 * in the same conversation thread.
 * 
 * @param {string} finalChatLogId - The ID of the chat log to update
 * @param {IChatMessage} formattedLastMessage - The new message to append to the chat log
 * @returns {Promise<void>} Promise that resolves when the update is complete
 * @throws {CustomError} Throws error if chat log is not found or update fails
 * 
 * @example
 * // Update an existing chat log with a new user message
 * await updateChatLog(
 *   "chat_log_123",
 *   {
 *     id: "msg_456",
 *     role: "user",
 *     content: "Thank you for the help!"
 *   }
 * );
 */
const updateChatLog = async (
  finalChatLogId: string,
  formattedLastMessage: IChatMessage
): Promise<void> => {
  // Update the chat log by appending the new message to the messages array
  const updated = await ChatLog.findByIdAndUpdate(
    finalChatLogId,
    { $push: { messages: formattedLastMessage } },
    { new: true }
  );
  
  // Ensure the chat log was found and updated successfully
  assert(updated, 404, "Chat log not found");
};

export default updateChatLog;
