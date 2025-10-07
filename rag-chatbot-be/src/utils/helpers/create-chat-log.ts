/**
 * Create Chat Log Helper Function
 * 
 * This module provides a utility function for creating new chat logs
 * in the RAG chatbot system. It handles the creation of chat log documents
 * and updates the user's chat log references.
 * 
 * The function ensures that new chat logs are properly associated with
 * the user and maintains referential integrity between User and ChatLog collections.
 * 
 * @fileoverview Utility function for creating new chat conversation logs
 */

import ChatLog from "@/models/chat-log";
import User from "@/models/user";
import { IChatMessage } from "@/types/chat-log-types";
import { assert } from "../assert";

/**
 * Creates a new chat log and associates it with a user
 * 
 * This function creates a new ChatLog document with the provided messages
 * and user ID, then updates the User document to include a reference to
 * the new chat log in the user's chatLogs array.
 * 
 * @param {string} userId - The ID of the user creating the chat log
 * @param {IChatMessage[]} formattedMessages - Array of formatted chat messages
 * @returns {Promise<string>} The ID of the newly created chat log
 * @throws {CustomError} Throws error if chat log creation or user update fails
 * 
 * @example
 * // Create a new chat log for a user
 * const chatLogId = await createChatLog(
 *   "user_123",
 *   [
 *     {
 *       id: "msg_1",
 *       role: "user",
 *       content: "Hello, I need help with my studies"
 *     }
 *   ]
 * );
 * console.log("Created chat log:", chatLogId);
 */
const createChatLog = async (
  userId: string,
  formattedMessages: IChatMessage[]
): Promise<string> => {
  // Create new chat log document with messages and user reference
  const newChatLog = new ChatLog({
    messages: formattedMessages,
    userId,
  });
  
  // Save the chat log to the database
  const newLog = await newChatLog.save();
  assert(newLog, 500, "Failed to create new chat log");

  // Update user document to include reference to the new chat log
  const updated = await User.findByIdAndUpdate(
    userId,
    { $push: { chatLogs: newChatLog.id } },
    { new: true }
  );
  assert(updated, 404, "User not found when updating chat logs");

  // Return the ID of the newly created chat log
  return newChatLog.id;
};

export default createChatLog;
