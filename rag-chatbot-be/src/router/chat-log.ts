/**
 * Chat Log Management Router
 * 
 * This module handles chat conversation history management for the RAG chatbot system.
 * It provides endpoints for retrieving and deleting chat logs, ensuring that users
 * can only access their own conversation history.
 * 
 * All endpoints require authentication and implement proper authorization checks
 * to ensure users can only access their own chat logs.
 * 
 * Endpoints:
 * - GET /api/chatlog - Retrieve all chat logs for authenticated user
 * - DELETE /api/chatlog/:id - Delete a specific chat log (user must own it)
 * 
 * @fileoverview Chat conversation history management API endpoints
 */

import { verifyToken } from "@/middleware/auth";
import ChatLog from "../models/chat-log";
import express, { NextFunction, Request, Response } from "express";
import { assert } from "@/utils/assert";

const router = express.Router();

/**
 * Get User's Chat Logs Endpoint
 * 
 * Retrieves all chat conversation logs for the authenticated user.
 * This endpoint requires authentication and returns only the chat logs
 * that belong to the requesting user.
 * 
 * @route GET /api/chatlog
 * @middleware verifyToken - Requires valid JWT authentication
 * @returns {Object[]} Array of chat log objects with messages and metadata
 * @returns {string} id - Chat log unique identifier
 * @returns {Object[]} messages - Array of conversation messages
 * @returns {string} createdAt - Chat log creation timestamp
 * @returns {string} userId - Owner's user ID
 * 
 * @example
 * // Request headers
 * Authorization: Bearer <jwt_token>
 * 
 * // Response
 * [
 *   {
 *     "id": "chat_log_123",
 *     "messages": [
 *       {
 *         "id": "msg_1",
 *         "role": "user",
 *         "content": "I need help with my studies"
 *       },
 *       {
 *         "id": "msg_2", 
 *         "role": "assistant",
 *         "content": "I'd be happy to help you with your studies..."
 *       }
 *     ],
 *     "createdAt": "2024-01-15T10:30:00.000Z",
 *     "userId": "user_456"
 *   }
 * ]
 */
router.get(
  "/",
  verifyToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Verify user is authenticated (should be set by verifyToken middleware)
      if (!req.user) {
        assert(req.user, 401, "Unauthorized");
      }

      // Retrieve all chat logs for the authenticated user
      const userId = req.user.id;
      const chatLog = await ChatLog.find({ userId: userId });
      assert(chatLog, 404, "No chat logs found for user");

      // Return the user's chat logs
      return res.json(chatLog);
    } catch (error) {
      console.error("Error fetching chat logs:", error);
      return next(error);
    }
  }
);

/**
 * Delete Chat Log Endpoint
 * 
 * Deletes a specific chat log if it belongs to the authenticated user.
 * This endpoint implements proper authorization to ensure users can only
 * delete their own chat logs, preventing unauthorized access to other
 * users' conversation history.
 * 
 * @route DELETE /api/chatlog/:id
 * @param {string} id - Chat log ID to delete (from URL parameters)
 * @middleware verifyToken - Requires valid JWT authentication
 * @returns {Object} Success message confirming deletion
 * @returns {string} message - Confirmation message
 * 
 * @example
 * // Request
 * DELETE /api/chatlog/chat_log_123
 * Authorization: Bearer <jwt_token>
 * 
 * // Response
 * {
 *   "message": "Chat log deleted successfully"
 * }
 * 
 * // Error responses
 * // 400: Chat log ID is required
 * // 401: Unauthorized (user doesn't own the chat log)
 * // 404: Chat log not found
 */
router.delete(
  "/:id",
  verifyToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Extract chat log ID from URL parameters
      const { id } = req.params;
      assert(id, 400, "Chat log ID is required");

      // Find the chat log to verify it exists
      const chatLogToDelete = await ChatLog.findById(id);
      assert(chatLogToDelete, 401, "Chat log not found");

      // Verify the chat log belongs to the authenticated user
      // This prevents users from deleting other users' chat logs
      assert(req.user.id === chatLogToDelete.userId.toString(), 401, "Unauthorized");

      // Delete the chat log from the database
      const deletedChatLog = await ChatLog.findByIdAndDelete(id);

      // Return success message if deletion was successful
      if (deletedChatLog) {
        return res.json({ message: "Chat log deleted successfully" });
      } else {
        // This should not happen due to previous checks, but included for safety
        return assert(deletedChatLog, 404, "Chat log not found");
      }
    } catch (error) {
      console.error("Error deleting chat log:", error);
      return next(error);
    }
  }
);

export default router;
