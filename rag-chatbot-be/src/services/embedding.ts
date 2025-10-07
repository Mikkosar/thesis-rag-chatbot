/**
 * Embedding Service
 * 
 * This module provides functions for generating vector embeddings using OpenAI's
 * text embedding models. Embeddings are numerical representations of text that
 * enable semantic search functionality in the RAG chatbot system.
 * 
 * The service supports both single text embedding generation and batch processing
 * for multiple texts, which is essential for efficient vector search operations.
 * 
 * @fileoverview OpenAI embedding generation service for semantic search
 */

import { assert } from "@/utils/assert";
import { openai } from "@ai-sdk/openai";
import { embed, embedMany } from "ai";
import dotenv from "dotenv";
dotenv.config();

/**
 * Generates a vector embedding for a single text input
 * 
 * This function converts text into a high-dimensional vector representation
 * using OpenAI's text-embedding-3-small model. The embedding enables semantic
 * similarity search in the knowledge base.
 * 
 * @param {string} text - The text to convert into an embedding vector
 * @returns {Promise<number[]>} Array of numbers representing the text embedding
 * @throws {CustomError} Throws error if embedding generation fails
 * 
 * @example
 * // Generate embedding for educational content
 * const embedding = await getEmbedding("Haaga-Helia offers special education support");
 * console.log("Embedding vector:", embedding);
 */
export const getEmbedding = async (text: string): Promise<number[]> => {
  // Generate text embedding using OpenAI's text-embedding-3-small model
  const { embedding } = await embed({
    model: openai.textEmbeddingModel("text-embedding-3-small"),
    value: text,
  });
  
  // Ensure embedding was generated successfully
  assert(embedding, 500, "Embedding generation failed");

  return embedding;
};

/**
 * Generates vector embeddings for multiple text inputs
 * 
 * This function efficiently processes multiple texts in a single API call,
 * generating embeddings for each text input. This is more efficient than
 * calling getEmbedding multiple times for batch operations.
 * 
 * @param {string[]} texts - Array of texts to convert into embedding vectors
 * @returns {Promise<number[][]>} Array of embedding vectors, one for each input text
 * @throws {CustomError} Throws error if batch embedding generation fails
 * 
 * @example
 * // Generate embeddings for multiple educational topics
 * const embeddings = await getMultipleEmbeddings([
 *   "Special education support services",
 *   "Student counseling and guidance",
 *   "Academic accommodation options"
 * ]);
 * console.log("Generated", embeddings.length, "embeddings");
 */
export const getMultipleEmbeddings = async (
  texts: string[]
): Promise<number[][]> => {
  // Generate embeddings for multiple texts in a single API call
  const { embeddings } = await embedMany({
    model: openai.textEmbeddingModel("text-embedding-3-small"),
    values: texts,
  });
  
  // Ensure embeddings were generated successfully
  assert(embeddings, 500, "Multiple embedding generation failed");

  return embeddings;
};
