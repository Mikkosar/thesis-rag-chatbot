/**
 * Express Application Configuration
 * 
 * This module sets up the main Express application with middleware configuration
 * for the RAG chatbot backend. It configures CORS, JSON parsing, request logging,
 * API routing, and error handling.
 * 
 * @fileoverview Main application setup and middleware configuration
 */

import express from "express";
import routes from "./router/index";
import cors from "cors";
import errorHandler from "./middleware/error-handler";

/**
 * Creates and configures the Express application instance
 * 
 * Sets up all necessary middleware including:
 * - Request logging for debugging and monitoring
 * - CORS configuration for frontend integration
 * - JSON body parsing for API requests
 * - API route mounting under /api prefix
 * - Global error handling middleware
 * 
 * @returns {express.Application} Configured Express application instance
 */
const createApp = () => {
  const app = express();

  // Request logging middleware - logs all incoming requests for debugging
  app.use((req, _res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });

  // Enable CORS for frontend integration
  // Allows cross-origin requests from frontend applications
  app.use(cors());
  
  // Parse JSON request bodies
  // Enables handling of JSON payloads in API requests
  app.use(express.json());

  // Mount all API routes under /api prefix
  // Routes are defined in ./router/index.ts
  app.use("/api", routes);
  
  // Additional request logging after route processing
  // This helps track requests that reach the error handler
  app.use((req, _res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });
  
  // Global error handling middleware
  // Must be last middleware to catch all errors
  app.use(errorHandler);

  return app;
};

export default createApp;
