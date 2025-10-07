/**
 * Chat Log Model
 * 
 * This module defines the ChatLog data model for storing conversation history
 * in the RAG chatbot system. Each chat log represents a complete conversation
 * session between a user and the AI assistant.
 * 
 * The ChatLog model stores an array of messages with roles (user/assistant/system)
 * and maintains relationships to the user who initiated the conversation.
 * 
 * @fileoverview Chat conversation history data model and schema definition
 * @author RAG Chatbot Team
 */

import { IMessage } from "@/types/chat-log-types";
import mongoose, { Model } from "mongoose";
const { Schema } = mongoose;

/**
 * Chat Log Interface
 * 
 * Defines the structure of a ChatLog document in the MongoDB database.
 * Represents a complete conversation session with message history and metadata.
 */
export interface IChatLog extends Document {
  /** Array of messages in the conversation */
  messages: IMessage[];
  /** Timestamp when the chat log was created */
  createdAt: Date;
  /** Reference to the user who owns this chat log */
  userId: mongoose.Types.ObjectId;
}

/**
 * Chat Log Schema Definition
 * 
 * Defines the MongoDB schema for ChatLog documents with embedded message
 * subdocuments and user references. Each message includes role validation
 * and automatic ID generation.
 */
const ChatLogSchema = new Schema<IChatLog>({
  /** Array of conversation messages */
  messages: [
    {
      /** Auto-generated unique ID for each message */
      _id: { type: Schema.Types.ObjectId, auto: true },
      
      /** Message role - must be one of: user, assistant, or system */
      role: {
        type: String,
        enum: ["user", "assistant", "system"],
        required: true,
      },
      
      /** Message content - the actual text of the message */
      content: { type: String, required: true },
    },
  ],
  
  /** Chat log creation timestamp - automatically set to current date */
  createdAt: { type: Date, default: Date.now },
  
  /** Reference to the User document who owns this chat log */
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

/**
 * JSON Transformation
 * 
 * Customizes the JSON output format for ChatLog documents:
 * - Converts MongoDB's _id to id for frontend compatibility
 * - Removes internal MongoDB fields (_id, __v) from JSON output
 * - Ensures clean API responses without internal database metadata
 */
ChatLogSchema.set("toJSON", {
  transform: (_document, returnedObject: any) => {
    returnedObject.id = returnedObject._id.toString();
    delete (returnedObject as any)._id;
    delete (returnedObject as any).__v;
  },
});

/**
 * Chat Log Model Export
 * 
 * Creates and exports the Mongoose model for ChatLog documents.
 * This model provides database operations for conversation history management.
 */
const ChatLog: Model<IChatLog> = mongoose.model<IChatLog>(
  "ChatLog",
  ChatLogSchema
);
export default ChatLog;
