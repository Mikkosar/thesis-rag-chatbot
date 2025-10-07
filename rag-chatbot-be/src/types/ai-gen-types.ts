/**
 * AI Generation Type Definitions
 * 
 * This module defines TypeScript types and Zod schemas for AI tool functionality
 * in the RAG chatbot system. It provides type safety for query optimization
 * and tool input validation used in AI generation processes.
 * 
 * The schemas define the structure for query optimization and tool inputs
 * that enable the AI to process and optimize user queries for better
 * vector search results.
 * 
 * @fileoverview TypeScript types and Zod schemas for AI tool operations
 * @author RAG Chatbot Team
 */

import { jsonSchema } from "ai";
import z from "zod";

/**
 * Zod Schema for Query Optimization Tool
 * 
 * Validates the input structure for query optimization operations.
 * Ensures that queries are provided as an array of 1-3 strings,
 * which is the optimal range for vector search operations.
 * 
 * This schema is used by the AI tool to optimize user queries before
 * performing vector searches in the knowledge base.
 * 
 * @constant {z.ZodObject} toolOptimazationSchemaZod
 * 
 * @example
 * // Valid optimization input
 * const optimizationInput = {
 *   queries: ["special education support", "student services"]
 * };
 * 
 * // This would be validated successfully
 * const result = toolOptimazationSchemaZod.parse(optimizationInput);
 */
export const toolOptimazationSchemaZod = z.object({
  /** Array of optimized query strings (1-3 queries for optimal search results) */
  queries: z.array(z.string()).min(1).max(3),
});

/**
 * Zod Schema for Tool Input
 * 
 * Validates the input structure for AI tool operations.
 * Ensures that a query string is provided with proper description
 * for context understanding.
 * 
 * This schema is used to validate user queries before they are
 * processed by AI tools for information retrieval.
 * 
 * @constant {z.ZodObject} toolInputSchemaZod
 * 
 * @example
 * // Valid tool input
 * const toolInput = {
 *   query: "I need help with special education support at Haaga-Helia"
 * };
 * 
 * // This would be validated successfully
 * const result = toolInputSchemaZod.parse(toolInput);
 */
export const toolInputSchemaZod = z.object({
  /** User's question and previous conversation context */
  query: z.string().describe("Käyttäjän kysymys ja aikaisempi keskustelu"),
});

/**
 * JSON Schema for Query Optimization (Fallback)
 * 
 * Alternative JSON schema definition for query optimization tool.
 * This is provided as a fallback in case Zod validation causes issues.
 * 
 * @constant {object} toolOptionSchemaJson
 */
export const toolOptionSchemaJson = jsonSchema<{
  queries: string[];
}>({
  type: "object",
  properties: {
    queries: {
      type: "array",
      items: {
        type: "string",
      },
    },
  },
  required: ["queries"],
});

/**
 * JSON Schema for Tool Input (Fallback)
 * 
 * Alternative JSON schema definition for tool input validation.
 * This is provided as a fallback in case Zod validation causes issues.
 * 
 * @constant {object} toolInputSchemaJson
 */
export const toolInputSchemaJson = jsonSchema<{
  query: string;
}>({
  type: "object",
  properties: {
    query: {
      type: "string",
      description: "Käyttäjän kysymys ja aikaisempi keskustelu",
    },
  },
  required: ["query"],
  additionalProperties: false,
});
