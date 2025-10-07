/**
 * Custom Error Class
 * 
 * This module defines a custom error class that extends the standard Error class
 * to include HTTP status codes and additional error information. This enables
 * more structured error handling throughout the RAG chatbot application.
 * 
 * The CustomError class is used by the global error handler middleware to
 * provide consistent error responses with appropriate HTTP status codes.
 * 
 * @fileoverview Custom error class with HTTP status code support
 */

/**
 * Custom Error Class
 * 
 * Extends the standard Error class to include HTTP status codes and optional
 * additional error details. This allows for more granular error handling
 * and consistent error responses across the API.
 * 
 * @class CustomError
 * @extends Error
 * 
 * @example
 * // Throwing a custom error
 * throw new CustomError(404, "User not found");
 * 
 * // Throwing with additional error details
 * throw new CustomError(400, "Validation failed", { field: "email", message: "Invalid format" });
 */
export default class CustomError extends Error {
  /** HTTP status code for the error response */
  status: number;
  
  /** Optional additional error details or validation errors */
  errors?: any;

  /**
   * Creates a new CustomError instance
   * 
   * @param {number} status - HTTP status code (e.g., 400, 401, 404, 500)
   * @param {string} message - Human-readable error message
   * @param {any} [errors] - Optional additional error details or validation errors
   */
  constructor(status: number, message: string, errors?: any) {
    super(message);
    this.status = status;
    this.errors = errors;
    
    // Ensure proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}
