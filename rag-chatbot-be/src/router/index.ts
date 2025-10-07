/**
 * Main Router Configuration
 * 
 * This module serves as the central router configuration for the RAG chatbot API.
 * It imports and mounts all sub-routers under the /api prefix, providing
 * a unified entry point for all API endpoints.
 * 
 * The router structure includes:
 * - Health check endpoint (/ping)
 * - User authentication routes (/user)
 * - Chat functionality routes (/chat)
 * - Chat log management routes (/chatlog)
 * - Knowledge base chunk management routes (/chunk)
 * 
 * @fileoverview Central API router configuration and route mounting
 * @author RAG Chatbot Team
 */

import chunk from "./chunk";
import chat from "./chat";
import user from "./user";
import chatLog from "./chat-log";

import { Router } from "express";

/**
 * Main API Router
 * 
 * Creates the primary Express router that will be mounted under /api prefix
 * in the main application. This router aggregates all sub-routers and provides
 * a centralized configuration point for the entire API.
 */
const router = Router();

/**
 * Health Check Endpoint
 * 
 * Simple ping endpoint for monitoring and health checks.
 * Returns "pong!" to confirm the server is running and accessible.
 * 
 * @route GET /api/ping
 * @returns {string} "pong!" - Server health confirmation
 */
router.get("/ping", (_req, res) => {
  res.send("pong!");
});

/**
 * Route Mounting
 * 
 * Mounts all sub-routers under their respective paths:
 * - /api/chunk - Knowledge base chunk management
 * - /api/chat - Chat functionality (streaming and non-streaming)
 * - /api/user - User authentication and registration
 * - /api/chatlog - Chat conversation history management
 */
router.use("/chunk", chunk);
router.use("/chat", chat);
router.use("/user", user);
router.use("/chatlog", chatLog);

export default router;
