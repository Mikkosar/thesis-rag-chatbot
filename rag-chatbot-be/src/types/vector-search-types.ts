/**
 * Vector Search Type Definitions
 * 
 * This module defines TypeScript interfaces and Zod schemas for vector search
 * functionality in the RAG chatbot system. It provides type safety for
 * semantic search operations and query optimization.
 * 
 * The types define the structure of search results and input validation
 * schemas for vector search operations using MongoDB Atlas Vector Search.
 * 
 * @fileoverview TypeScript types and Zod schemas for vector search operations
 * @author RAG Chatbot Team
 */

import z from "zod";

/**
 * Individual Search Result Interface
 * 
 * Represents a single search hit from vector search operations.
 * Contains the content that matched the query and a relevance score.
 * 
 * @interface SearchHit
 * 
 * @example
 * const searchResult: SearchHit = {
 *   content: "Haaga-Helia University offers special education support...",
 *   score: 0.95
 * };
 */
export interface SearchHit {
  /** The text content that matched the search query */
  content: string;
  
  /** Relevance score indicating how well the content matches the query (0-1) */
  score: number;
}

/**
 * Type alias for an array of search results
 * 
 * Represents the complete set of search results returned from
 * a vector search operation.
 * 
 * @type SearchHits
 */
export type SearchHits = SearchHit[];

/**
 * Zod Schema for Vector Search Input Validation
 * 
 * Validates the input structure for vector search operations.
 * Ensures that queries are provided as an array of strings.
 * 
 * This schema is used to validate requests to the vector search
 * functionality before processing them.
 * 
 * @constant {z.ZodObject} getInformationInputSchema
 * 
 * @example
 * // Valid input
 * const validInput = {
 *   queries: ["special education support", "student services"]
 * };
 * 
 * // This would be validated successfully
 * const result = getInformationInputSchema.parse(validInput);
 */
export const getInformationInputSchema = z.object({
  /** Array of search query strings */
  queries: z.array(z.string()),
});
