/**
 * Authentication Middleware
 * 
 * This module provides JWT-based authentication middleware for the RAG chatbot API.
 * It includes both optional and required authentication middleware to handle
 * different authentication requirements across API endpoints.
 * 
 * @fileoverview JWT token validation and user authentication middleware
 */

import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import User from "../models/user";
import { assert } from "@/utils/assert";

/**
 * Optional Authentication Middleware
 * 
 * This middleware attempts to authenticate the user if a valid JWT token is provided
 * in the Authorization header. If no token is provided or the token is invalid,
 * the request continues without authentication (no error is thrown).
 * 
 * This is useful for endpoints that can work with or without authentication,
 * such as chat endpoints that provide different functionality based on user status.
 * 
 * @param {Request} req - Express request object
 * @param {Response} _res - Express response object (unused)
 * @param {NextFunction} next - Express next function
 * 
 * @example
 * // Usage in routes that support both authenticated and anonymous access
 * router.post('/chat', optionalVerifyToken, chatController);
 */
export const optionalVerifyToken = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    // Extract JWT token from Authorization header
    // Expected format: "Bearer <token>"
    const token = req.header("Authorization")?.split(" ")[1];
    
    // If no token provided, continue without authentication
    if (!token) {
      return next();
    }

    // Validate JWT secret is configured
    const jwtSecret = process.env.JWT_SECRET;
    assert(
      jwtSecret,
      500,
      "JWT_SECRET is not defined in the environment variables"
    );

    // Verify and decode the JWT token
    const decoded = jwt.verify(token, jwtSecret) as {
      id: string;
      email: string;
      password: string;
    };
    assert(decoded, 401, "Invalid token");

    // Fetch user from database using token's user ID
    const user = await User.findById(decoded.id);
    assert(user, 404, "User not found, token is invalid");

    // Attach authenticated user to request object
    req.user = user;
    next();
  } catch (error) {
    // Pass any errors to the error handling middleware
    next(error);
  }
};

/**
 * Required Authentication Middleware
 * 
 * This middleware enforces authentication for protected endpoints. If no valid
 * JWT token is provided in the Authorization header, the request is rejected
 * with a 401 Unauthorized error.
 * 
 * This is used for endpoints that require user authentication, such as
 * accessing user-specific chat logs or user profile management.
 * 
 * @param {Request} req - Express request object
 * @param {Response} _res - Express response object (unused)
 * @param {NextFunction} next - Express next function
 * 
 * @example
 * // Usage in protected routes
 * router.get('/chatlog', verifyToken, getChatLogsController);
 */
export const verifyToken = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    // Extract JWT token from Authorization header
    // Expected format: "Bearer <token>"
    const token = req.header("Authorization")?.split(" ")[1];
    
    // Require token for protected endpoints
    assert(token, 401, "No token provided");

    // Validate JWT secret is configured
    const jwtSecret = process.env.JWT_SECRET;
    assert(
      jwtSecret,
      500,
      "JWT_SECRET is not defined in the environment variables"
    );

    // Verify and decode the JWT token
    const decoded = jwt.verify(token, jwtSecret) as {
      id: string;
      email: string;
      password: string;
    };
    assert(decoded, 401, "Invalid token");

    // Fetch user from database using token's user ID
    const user = await User.findById(decoded.id);
    assert(user, 404, "User not found, token is invalid");

    // Attach authenticated user to request object
    req.user = user;
    next();
  } catch (error) {
    // Log authentication errors for debugging
    console.error("Error verifying token:", error);
    next(error);
  }
};
