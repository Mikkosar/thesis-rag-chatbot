/**
 * Chat Log Persistence Service
 * 
 * This module handles the persistence of chat conversations in the RAG chatbot system.
 * It manages both creating new chat logs and updating existing ones, ensuring that
 * conversation history is properly stored and associated with the correct user.
 * 
 * The service implements intelligent chat log management that can either:
 * - Update an existing chat log by appending new messages
 * - Create a new chat log for new conversations
 * - Maintain referential integrity between users and their chat logs
 * 
 * Key responsibilities:
 * - Chat log creation and updates
 * - User-chat log relationship management
 * - Message persistence and organization
 * - Database transaction handling
 * 
 * @fileoverview Chat conversation persistence and management service
 */

import ChatLog from "@/models/chat-log";
import User from "@/models/user";
import { IChatMessage, IChatMessages } from "@/types/chat-log-types";
import { assert } from "@/utils/assert";

/**
 * Saves or updates chat conversation logs in the database
 * 
 * This function handles the persistence of chat conversations by either updating
 * an existing chat log or creating a new one. It ensures that conversation history
 * is properly maintained and associated with the correct user account.
 * 
 * The function implements intelligent logic:
 * - If chatLogId is provided: Updates existing chat log with new messages
 * - If chatLogId is undefined: Creates new chat log and associates it with user
 * - Maintains referential integrity between User and ChatLog collections
 * - Handles both single conversations and ongoing chat sessions
 * 
 * @param {string | undefined} chatLogId - Existing chat log ID (if updating) or undefined (if creating new)
 * @param {string} userId - ID of the user who owns the chat log
 * @param {IChatMessages} messages - Array of conversation messages including user input
 * @param {IChatMessage} assistantResponse - AI-generated response message
 * @returns {Promise<string>} The chat log ID (existing or newly created)
 * @throws {CustomError} Throws error if chat log operations fail
 */
const saveChatLog = async (
  chatLogId: string | undefined,
  userId: string,
  messages: IChatMessages,
  assistantResponse: IChatMessage
) => {
  // Update existing chat log if chatLogId is provided
  if (chatLogId) {
    // Create array with the latest user message and new assistant response
    // This ensures we only append the most recent exchange to the existing log
    const newQueryAndResponse: IChatMessages = [
      messages[messages.length - 1],  // Latest user message
      assistantResponse,               // New assistant response
    ];
    
    // Update existing chat log by appending new messages
    const updatedLog = await ChatLog.findByIdAndUpdate(
      chatLogId,
      { $push: { messages: newQueryAndResponse } },
      { new: true }
    );
    assert(updatedLog, 404, "Chat log not found");
    
    // Return the existing chat log ID
    return chatLogId;
  } else {
    // Create new chat log for new conversations
    const newChatLog = new ChatLog({
      messages: [...messages, assistantResponse],  // Include all messages plus new response
      userId,                                     // Associate with the user
    });
    
    // Save the new chat log to the database
    const newLog = await newChatLog.save();
    assert(newLog, 500, "Failed to create new chat log");

    // Update user document to include reference to the new chat log
    // This maintains referential integrity between User and ChatLog collections
    const updatedUserChatLogs = await User.findByIdAndUpdate(userId, {
      $push: { chatLogs: newLog.id },
    });

    // Ensure user was found and updated successfully
    assert(updatedUserChatLogs, 404, "User not found");

    // Return the newly created chat log ID
    return newLog.id;
  }
};

export default saveChatLog;
