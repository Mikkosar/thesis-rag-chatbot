/**
 * Database Configuration
 * 
 * This module handles MongoDB database connection setup for the RAG chatbot backend.
 * It establishes the connection to MongoDB Atlas and handles connection errors.
 * 
 * @fileoverview MongoDB connection configuration and initialization
 * @author RAG Chatbot Team
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

/**
 * Establishes connection to MongoDB database
 * 
 * This function connects to the MongoDB database using the connection string
 * from environment variables. It handles connection errors and ensures
 * the application exits gracefully if the database connection fails.
 * 
 * The connection uses MongoDB Atlas cloud database service and includes
 * automatic retry logic and connection pooling through Mongoose.
 * 
 * @async
 * @function connectDB
 * @throws {Error} If database connection fails
 * 
 * @example
 * // Usage in application startup
 * await connectDB();
 */
export const connectDB = async () => {
  try {
    // Connect to MongoDB using connection string from environment variables
    // MONGO_URI should be in format: mongodb+srv://username:password@cluster.mongodb.net/database
    await mongoose.connect(process.env.MONGO_URI || "");
    
    // Log successful connection
    console.log("MongoDB connected");
  } catch (error) {
    // Log connection error for debugging
    console.error("MongoDB connection error:", error);
    
    // Exit application if database connection fails
    // This prevents the server from running without database access
    process.exit(1);
  }
};
