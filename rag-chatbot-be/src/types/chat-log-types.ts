/**
 * Chat Log Type Definitions
 * 
 * This module defines TypeScript interfaces and types for chat message handling
 * in the RAG chatbot system. It provides type safety for message structures
 * used throughout the chat functionality.
 * 
 * The types define the structure of individual messages and collections of
 * messages used in chat conversations and database storage.
 * 
 * @fileoverview TypeScript type definitions for chat messages and conversations
 * @author RAG Chatbot Team
 */

/**
 * Individual Chat Message Interface
 * 
 * Defines the structure of a single chat message with role-based typing.
 * Messages can be from users, the AI assistant, or system messages.
 * 
 * @interface IMessage
 * 
 * @example
 * // User message
 * const userMessage: IMessage = {
 *   id: "msg_123",
 *   role: "user",
 *   content: "I need help with my studies"
 * };
 * 
 * // Assistant message
 * const assistantMessage: IMessage = {
 *   id: "msg_124",
 *   role: "assistant",
 *   content: "I'd be happy to help you with your studies..."
 * };
 */
export interface IMessage {
  /** Unique identifier for the message */
  id: string;
  
  /** Role of the message sender - determines message origin and behavior */
  role: "user" | "assistant" | "system";
  
  /** The actual text content of the message */
  content: string;
}

/**
 * Type alias for an array of chat messages
 * 
 * Represents a complete conversation or message history.
 * Used throughout the application for handling chat conversations.
 * 
 * @type IChatMessages
 */
export type IChatMessages = IMessage[];

/**
 * Type alias for a single chat message
 * 
 * Alternative way to reference a single IMessage instance.
 * Provides semantic clarity when working with individual messages.
 * 
 * @type IChatMessage
 */
export type IChatMessage = IMessage;
