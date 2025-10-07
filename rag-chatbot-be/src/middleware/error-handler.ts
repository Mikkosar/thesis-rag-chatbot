/**
 * Global Error Handling Middleware
 * 
 * This module provides centralized error handling for the RAG chatbot API.
 * It catches all errors thrown throughout the application and returns
 * appropriate HTTP status codes and error messages to the client.
 * 
 * The middleware handles various types of errors including:
 * - Custom application errors
 * - MongoDB validation and casting errors
 * - JWT authentication errors
 * - Generic server errors
 * 
 * @fileoverview Centralized error handling and response formatting
 */

import CustomError from "@/types/custom-error";
import { Request, Response, NextFunction } from "express";

/**
 * Global Error Handler Middleware
 * 
 * This middleware catches all errors thrown in the application and formats
 * them into consistent JSON responses with appropriate HTTP status codes.
 * 
 * Error handling priority:
 * 1. Custom application errors (CustomError instances)
 * 2. MongoDB-specific errors (CastError, ValidationError)
 * 3. JWT authentication errors (JsonWebTokenError, TokenExpiredError)
 * 4. Generic server errors (500 Internal Server Error)
 * 
 * @param {Error} err - The error object thrown by the application
 * @param {Request} _req - Express request object (unused)
 * @param {Response} res - Express response object
 * @param {NextFunction} _next - Express next function (unused)
 * 
 * @returns {void} Sends JSON error response to client
 */
const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  // Log all errors for debugging and monitoring
  console.error(err);

  // Handle custom application errors
  // These are errors thrown by the application with specific status codes
  if (err instanceof CustomError) {
    return res.status(err.status).json({
      success: false,
      error: {
        type: err.name || "CustomError",
        message: err.message,
        // Include stack trace in development environment only
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
      },
    });
  }

  // Handle MongoDB ObjectId casting errors
  // Occurs when an invalid ObjectId format is provided
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      error: { type: "CastError", message: "Malformatted id" },
    });
  }

  // Handle MongoDB validation errors
  // Occurs when document validation fails (e.g., required fields missing)
  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      error: { type: "ValidationError", message: err.message },
    });
  }

  // Handle JWT signature verification errors
  // Occurs when JWT token signature is invalid
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      error: { type: "Unauthorized", message: "Invalid token" },
    });
  }

  // Handle JWT token expiration errors
  // Occurs when JWT token has expired
  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      error: { type: "Unauthorized", message: "Token expired" },
    });
  }

  // Handle all other unhandled errors
  // Returns generic 500 Internal Server Error
  return res.status(500).json({
    success: false,
    error: {
      type: "InternalServerError",
      message: "Something went wrong",
      // Include stack trace in development environment only
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    },
  });
};

export default errorHandler;
