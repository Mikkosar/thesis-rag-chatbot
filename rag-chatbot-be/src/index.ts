/**
 * Application Entry Point
 * 
 * This is the main entry point for the RAG chatbot backend server.
 * It handles database connection initialization and starts the Express server.
 * 
 * @fileoverview Server startup and database connection initialization
 */

import createApp from "./app";
import { connectDB } from "./config/db";

// Server port configuration from environment variables
const PORT = Number(process.env.PORT);

/**
 * Initializes and starts the server
 * 
 * This function performs the following operations:
 * 1. Establishes connection to MongoDB database
 * 2. Creates and configures the Express application
 * 3. Starts the HTTP server on the specified port
 * 
 * @async
 * @function startServer
 * @throws {Error} If database connection fails or server startup fails
 */
const startServer = async () => {
  // Connect to MongoDB database
  // This must complete before starting the server
  await connectDB();

  // Create the Express application with all middleware and routes
  const app = createApp();

  // Start the HTTP server
  // Defaults to port 3000 if PORT environment variable is not set
  app.listen(PORT || 3000, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};

// Start the server and handle any startup errors
// If startup fails, log the error and exit the process
startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
