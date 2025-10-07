/**
 * User Model
 * 
 * This module defines the User data model for the RAG chatbot system.
 * It represents registered users who can authenticate and maintain
 * chat conversation history.
 * 
 * The User model includes personal information, authentication credentials,
 * and references to chat logs for maintaining conversation history.
 * 
 * @fileoverview User data model and schema definition
 * @author RAG Chatbot Team
 */

import mongoose, { Document, Model } from "mongoose";
const { Schema } = mongoose;

/**
 * User Interface
 * 
 * Defines the structure of a User document in the MongoDB database.
 * Includes personal information, authentication data, and relationships
 * to other collections.
 */
interface IUser extends Document {
  /** User's first name */
  firstName: string;
  /** User's last name */
  lastName: string;
  /** Hashed password for authentication */
  password: string;
  /** User's email address (unique identifier) */
  email: string;
  /** Timestamp when user account was created */
  createdAt: Date;
  /** Array of chat log IDs associated with this user */
  chatLogs: mongoose.Types.ObjectId[];
}

/**
 * User Schema Definition
 * 
 * Defines the MongoDB schema for User documents with validation rules
 * and field requirements. Includes automatic timestamp generation and
 * references to related ChatLog documents.
 */
const UserSchema = new Schema<IUser>({
  /** User's first name - required field */
  firstName: { type: String, required: true },
  
  /** User's last name - required field */
  lastName: { type: String, required: true },
  
  /** Hashed password - required for authentication */
  password: { type: String, required: true },
  
  /** Email address - required and must be unique across all users */
  email: { type: String, required: true, unique: true },
  
  /** Account creation timestamp - automatically set to current date */
  createdAt: { type: Date, default: Date.now },
  
  /** Array of chat log ObjectIds - references to ChatLog collection */
  chatLogs: [{ type: mongoose.Schema.Types.ObjectId, ref: "ChatLog" }],
});

/**
 * JSON Transformation
 * 
 * Customizes the JSON output format for User documents:
 * - Converts MongoDB's _id to id for frontend compatibility
 * - Removes internal MongoDB fields (_id, __v) from JSON output
 * - Ensures clean API responses without internal database metadata
 */
UserSchema.set("toJSON", {
  transform: (_document, returnedObject: any) => {
    returnedObject.id = returnedObject._id.toString();
    delete (returnedObject as any)._id;
    delete (returnedObject as any).__v;
  },
});

/**
 * User Model Export
 * 
 * Creates and exports the Mongoose model for User documents.
 * This model provides database operations for user management.
 */
const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);
export default User;
