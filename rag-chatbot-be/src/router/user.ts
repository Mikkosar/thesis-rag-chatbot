/**
 * User Authentication Router
 * 
 * This module handles user authentication and registration endpoints for the
 * RAG chatbot system. It provides secure user account management with
 * password hashing and JWT token generation.
 * 
 * Endpoints:
 * - POST /api/user/login - User authentication with JWT token generation
 * - POST /api/user/register - New user registration with password hashing
 * 
 * @fileoverview User authentication and registration API endpoints
 * @author RAG Chatbot Team
 */

import User from "../models/user";
import express, { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { assert } from "@/utils/assert";
dotenv.config();

const router = express.Router();

/**
 * User Login Endpoint
 * 
 * Authenticates a user with email and password, returning a JWT token
 * for subsequent authenticated requests. The token expires after 1 hour.
 * 
 * @route POST /api/user/login
 * @param {string} email - User's email address
 * @param {string} password - User's plain text password
 * @returns {Object} Authentication response with JWT token and user info
 * @returns {string} token - JWT token for authentication
 * @returns {string} userId - User's unique identifier
 * @returns {string} firstname - User's first name
 * @returns {string} email - User's email address
 * 
 * @example
 * // Request body
 * {
 *   "email": "user@example.com",
 *   "password": "userpassword"
 * }
 * 
 * // Response
 * {
 *   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
 *   "userId": "507f1f77bcf86cd799439011",
 *   "firstname": "John",
 *   "email": "user@example.com"
 * }
 */
router.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      
      // Validate required fields
      assert(email && password, 400, "Email and password are required");

      // Find user by email and verify password
      const user = await User.findOne({ email });
      const isPasswordValid =
        user === null ? false : await bcrypt.compare(password, user.password);
      assert(user && isPasswordValid, 401, "Invalid email or password");

      // Generate JWT token
      const jwtSecret = process.env.JWT_SECRET;
      assert(jwtSecret, 500, "JWT secret not configured");
      const forToken = {
        id: user._id,
        email: user.email,
        password: user.password,
      };
      // Token expires after 1 hour (3600 seconds)
      const token = jwt.sign(forToken, jwtSecret, { expiresIn: 60 * 60 });
      assert(token, 500, "Failed to generate token");

      // Return authentication response
      return res.status(200).json({
        token: token,
        userId: user._id,
        firstname: user.firstName,
        email: user.email,
      });
    } catch (error) {
      console.error("Error processing user route:", error);
      return next(error);
    }
  }
);

/**
 * User Registration Endpoint
 * 
 * Creates a new user account with hashed password storage. Validates that
 * the email address is unique and returns user information without
 * sensitive data like passwords.
 * 
 * @route POST /api/user/register
 * @param {string} firstName - User's first name
 * @param {string} lastName - User's last name
 * @param {string} email - User's email address (must be unique)
 * @param {string} password - User's plain text password (will be hashed)
 * @returns {Object} User information without sensitive data
 * @returns {string} firstName - User's first name
 * @returns {string} lastName - User's last name
 * @returns {string} email - User's email address
 * 
 * @example
 * // Request body
 * {
 *   "firstName": "John",
 *   "lastName": "Doe",
 *   "email": "john.doe@example.com",
 *   "password": "securepassword"
 * }
 * 
 * // Response
 * {
 *   "firstName": "John",
 *   "lastName": "Doe",
 *   "email": "john.doe@example.com"
 * }
 */
router.post(
  "/register",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { firstName, lastName, email, password } = req.body;
      
      // Validate all required fields
      assert(
        firstName && lastName && email && password,
        400,
        "All fields are required"
      );

      // Check if user already exists
      const doesUserExist = await User.findOne({ email });
      assert(!doesUserExist, 409, "User with this email already exists");

      // Create new user with hashed password
      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = new User({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: passwordHash,
      });
      const savedUser = await newUser.save();
      assert(savedUser, 500, "Failed to save user");

      // Return user information without sensitive data
      return res.status(201).json({
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        email: savedUser.email,
      });
    } catch (error) {
      console.error("Error processing user route:", error);
      return next(error);
    }
  }
);

export default router;
