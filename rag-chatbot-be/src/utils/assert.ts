/**
 * Assertion Utility Function
 * 
 * This module provides a custom assertion function that throws structured
 * errors with HTTP status codes. It's used throughout the RAG chatbot
 * application for input validation and error handling.
 * 
 * The assert function helps maintain consistent error handling by providing
 * a unified way to validate conditions and throw appropriate errors.
 * 
 * @fileoverview Custom assertion function with HTTP status code support
 * @author RAG Chatbot Team
 */

import CustomError from "@/types/custom-error";

/**
 * Custom Assertion Function
 * 
 * Validates a condition and throws a CustomError with the specified
 * HTTP status code and message if the condition is falsy. This provides
 * a consistent way to handle validation errors throughout the application.
 * 
 * @param {any} condition - The condition to validate (any falsy value will trigger the error)
 * @param {number} status - HTTP status code to include in the error response
 * @param {string} message - Error message to display to the client
 * @throws {CustomError} Throws a CustomError if the condition is falsy
 * 
 * @example
 * // Validate required fields
 * assert(email && password, 400, "Email and password are required");
 * 
 * // Validate user existence
 * assert(user, 404, "User not found");
 * 
 * // Validate operation success
 * assert(savedUser, 500, "Failed to save user");
 */
export function assert(
  condition: any,
  status: number,
  message: string
): asserts condition {
  if (!condition) {
    throw new CustomError(status, message);
  }
}
