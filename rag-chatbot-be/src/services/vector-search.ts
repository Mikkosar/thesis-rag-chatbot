/**
 * Vector Search Service
 * 
 * This module provides semantic search functionality using MongoDB Atlas Vector Search.
 * It enables the RAG chatbot to find relevant information from the knowledge base
 * by comparing vector embeddings of user queries with stored document chunks.
 * 
 * The service performs parallel searches across multiple optimized queries and
 * returns ranked, deduplicated results based on semantic similarity scores.
 * 
 * @fileoverview MongoDB Atlas Vector Search service for semantic information retrieval
 * @author RAG Chatbot Team
 */

import { getMultipleEmbeddings } from "./embedding";
import Chunk from "../models/chunk";
import { SearchHits } from "../types/vector-search-types";

/**
 * Performs semantic search across the knowledge base using vector similarity
 * 
 * This function takes multiple optimized queries, generates embeddings for each,
 * and performs parallel vector searches against the MongoDB Atlas Vector Search
 * index. Results are ranked by relevance score and deduplicated by content.
 * 
 * The search uses MongoDB's $vectorSearch aggregation pipeline with the following
 * configuration:
 * - Index: "vector_index" (defined in MongoDB Atlas)
 * - Path: "embedding" field in Chunk documents
 * - Candidates: 10 (number of candidates to consider)
 * - Limit: 5 (maximum results per query)
 * 
 * @param {string[]} queries - Array of optimized search queries
 * @returns {Promise<SearchHits[]>} Array of search results with content and relevance scores
 * @throws {Error} Throws error if vector search operation fails
 * 
 * @example
 * // Search for information about special education support
 * const results = await findInformation([
 *   "special education support services",
 *   "student accommodation options",
 *   "learning disability assistance"
 * ]);
 * 
 * // Process results
 * results.forEach(result => {
 *   console.log(`Content: ${result.content}, Score: ${result.score}`);
 * });
 */
export const findInformation = async (
  queries: string[]
): Promise<SearchHits[]> => {
  // Generate embeddings for all queries in parallel
  const embeddings = await getMultipleEmbeddings(queries);

  try {
    // Perform parallel vector searches for each query
    const results = await Promise.all(
      embeddings.map(async (embedding) => {
        // MongoDB Atlas Vector Search aggregation pipeline
        const agg = [
          {
            $vectorSearch: {
              index: "vector_index",           // Vector search index name
              path: "embedding",              // Field containing embeddings
              queryVector: embedding,          // Query embedding vector
              numCandidates: 10,              // Number of candidates to consider
              limit: 5,                       // Maximum results per query
            },
          },
          {
            $project: {
              _id: 0,                         // Exclude document ID
              content: 1,                     // Include content field
              score: { $meta: "vectorSearchScore" }, // Include relevance score
            },
          },
        ];
        
        // Execute aggregation pipeline
        return Chunk.aggregate(agg);
      })
    );

    // Flatten all results and sort by relevance score (highest first)
    const flat = results.flat().sort((a, b) => b.score - a.score);

    // Remove duplicate results based on content
    // This ensures unique information even if multiple queries return similar content
    const seen = new Set<string>();
    const unique = flat.filter((item) => {
      if (seen.has(item.content)) return false;
      seen.add(item.content);
      return true;
    });

    return unique;
  } catch (error) {
    console.error("Error fetching information:", error);
    throw new Error("Error fetching information");
  }
};
