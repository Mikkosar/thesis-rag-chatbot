/**
 * Knowledge Base Chunk Management Router
 * 
 * This module handles CRUD operations for knowledge base chunks in the RAG chatbot system.
 * Chunks are segmented pieces of institutional knowledge that are embedded as vectors
 * for semantic search functionality. This router provides endpoints for managing the
 * knowledge base content that powers the chatbot's retrieval-augmented generation.
 * 
 * The router supports both manual chunk creation and AI-powered automatic chunking
 * from longer documents, enabling efficient knowledge base management.
 * 
 * Endpoints:
 * - GET /api/chunk - Retrieve all chunks (without embeddings)
 * - GET /api/chunk/:id - Retrieve specific chunk by ID
 * - POST /api/chunk - Create single chunk with embedding generation
 * - POST /api/chunk/multiple - Create multiple chunks from document using AI
 * - PUT /api/chunk/:id - Update chunk (regenerates embedding if content changes)
 * - DELETE /api/chunk/:id - Delete specific chunk
 * 
 * @fileoverview Knowledge base chunk management API endpoints
 */

import { getEmbedding } from "../services/embedding";
import Chunk from "../models/chunk";
import express, { NextFunction, Request, Response } from "express";
import { assert } from "@/utils/assert";
import { createChunks } from "@/services/chunk-creation";

const router = express.Router();

/**
 * Get All Chunks Endpoint
 * 
 * Retrieves all knowledge base chunks without their embedding vectors.
 * Embeddings are excluded to reduce response size and protect sensitive
 * vector data. This endpoint is useful for browsing and managing the
 * knowledge base content.
 * 
 * @route GET /api/chunk
 * @returns {Object[]} Array of chunk objects without embeddings
 * @returns {string} id - Chunk unique identifier
 * @returns {string} title - Chunk title/heading
 * @returns {string} content - Chunk text content
 * @returns {string} timestamp - Chunk creation timestamp
 * 
 * @example
 * // Response
 * [
 *   {
 *     "id": "chunk_123",
 *     "title": "Special Education Support",
 *     "content": "Haaga-Helia University offers comprehensive support...",
 *     "timestamp": "2024-01-15T10:30:00.000Z"
 *   }
 * ]
 */
router.get("/", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    // Retrieve all chunks excluding embedding vectors for efficiency
    const chunks = await Chunk.find({}).select("-embedding");
    assert(chunks, 404, "No chunks found");
    return res.json(chunks);
  } catch (error) {
    console.error("Error fetching chunks:", error);
    return next(error);
  }
});

/**
 * Get Specific Chunk Endpoint
 * 
 * Retrieves a specific knowledge base chunk by its ID.
 * Note: This endpoint currently has a bug where it always returns 404.
 * It should return the chunk data when found.
 * 
 * @route GET /api/chunk/:id
 * @param {string} id - Chunk ID (from URL parameters)
 * @returns {Object} Chunk object without embedding
 * @returns {string} id - Chunk unique identifier
 * @returns {string} title - Chunk title/heading
 * @returns {string} content - Chunk text content
 * @returns {string} timestamp - Chunk creation timestamp
 * 
 * @example
 * // Request
 * GET /api/chunk/chunk_123
 * 
 * // Response (when bug is fixed)
 * {
 *   "id": "chunk_123",
 *   "title": "Special Education Support",
 *   "content": "Haaga-Helia University offers comprehensive support...",
 *   "timestamp": "2024-01-15T10:30:00.000Z"
 * }
 */
router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Find chunk by ID (excluding embedding for efficiency)
    const chunk = await Chunk.findById(req.params.id);
    assert(chunk, 404, "Chunk not found");
    
    // Return chunk data  
    return res.json(chunk);

  } catch (error) {
    console.error("Error fetching chunk:", error);
    return next(error);
  }
});

/**
 * Create Single Chunk Endpoint
 * 
 * Creates a new knowledge base chunk with automatic embedding generation.
 * This endpoint is used for manually adding individual pieces of knowledge
 * to the chatbot's knowledge base. The embedding is generated using OpenAI's
 * text-embedding-3-small model for semantic search functionality.
 * 
 * @route POST /api/chunk
 * @param {string} title - Chunk title/heading
 * @param {string} content - Chunk text content
 * @returns {Object} Created chunk data (without embedding)
 * @returns {string} title - Chunk title
 * @returns {string} content - Chunk content
 * 
 * @example
 * // Request body
 * {
 *   "title": "Student Counseling Services",
 *   "content": "Haaga-Helia provides professional counseling services..."
 * }
 * 
 * // Response
 * {
 *   "title": "Student Counseling Services",
 *   "content": "Haaga-Helia provides professional counseling services..."
 * }
 */
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, content } = req.body;
    
    // Validate required fields
    assert(title && content, 400, "Title and content are required");

    // Generate vector embedding for semantic search
    const embedding = await getEmbedding(content);
    assert(embedding, 500, "Failed to generate embedding");

    // Create and save new chunk with embedding
    const newChunk = new Chunk({
      title: title,
      content: content,
      embedding: embedding,
    });
    const savedChunk = await newChunk.save();
    assert(savedChunk, 500, "Failed to save chunk");

    // Return chunk data without embedding for security
    return res.status(201).json({
      title: savedChunk.title,
      content: savedChunk.content,
    });
  } catch (error) {
    console.error("Error creating chunk:", error);
    return next(error);
  }
});

/**
 * Create Multiple Chunks from Document Endpoint
 * 
 * Uses AI to automatically split a long document into semantically meaningful
 * chunks. This endpoint leverages OpenAI's GPT-4o model to intelligently
 * segment documents while maintaining semantic coherence and staying within
 * size limits optimal for vector search.
 * 
 * @route POST /api/chunk/multiple
 * @param {string} text - Long document text to be chunked
 * @returns {Object} AI-generated chunks
 * @returns {string[]} chunks - Array of chunked text segments
 * 
 * @example
 * // Request body
 * {
 *   "text": "Haaga-Helia University of Applied Sciences offers comprehensive support services for students with special needs. The university provides various accommodation options, counseling services, and academic support programs. Students can access these services through the student services office..."
 * }
 * 
 * // Response
 * {
 *   "chunks": [
 *     "Haaga-Helia University offers comprehensive support services for students with special needs.",
 *     "The university provides various accommodation options and counseling services.",
 *     "Students can access these services through the student services office."
 *   ]
 * }
 */
router.post("/multiple", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const x: string = req.body.text;
    
    // Validate input text
    assert(x, 400, "Input text is required");

    // Use AI to create semantically meaningful chunks
    const chunks = await createChunks(x);
    assert(chunks, 500, "Failed to create chunks");
    
    return res.status(201).json(chunks);
  } catch (error) {
    console.error("Error creating chunks:", error);
    return next(error);
  }
});

/**
 * Delete Chunk Endpoint
 * 
 * Removes a specific knowledge base chunk from the database.
 * This operation is permanent and will affect the chatbot's knowledge base
 * and search capabilities. Use with caution.
 * 
 * @route DELETE /api/chunk/:id
 * @param {string} id - Chunk ID to delete (from URL parameters)
 * @returns {void} 204 No Content on successful deletion
 * @returns {Object} Error object if chunk not found
 * 
 * @example
 * // Request
 * DELETE /api/chunk/chunk_123
 * 
 * // Response (success)
 * 204 No Content
 * 
 * // Response (not found)
 * {
 *   "error": "Chunk not found"
 * }
 */
router.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      
      // Validate chunk ID
      assert(id, 400, "ID is required");

      // Delete chunk by ID
      const chunk = await Chunk.findByIdAndDelete(req.params.id);
      
      if (chunk) {
        // Return 204 No Content on successful deletion
        return res.status(204).send();
      }
      
      // Return 404 if chunk not found
      return res.status(404).json({ error: "Chunk not found" });
    } catch (error) {
      console.error("Error deleting chunk:", error);
      return next(error);
    }
  }
);

/**
 * Update Chunk Endpoint
 * 
 * Updates an existing knowledge base chunk. If the content is modified,
 * a new embedding is automatically generated to maintain semantic search
 * accuracy. If only the title is updated, the existing embedding is preserved
 * for efficiency.
 * 
 * @route PUT /api/chunk/:id
 * @param {string} id - Chunk ID to update (from URL parameters)
 * @param {string} [title] - New chunk title
 * @param {string} [content] - New chunk content
 * @returns {Object} Updated chunk object
 * @returns {string} id - Chunk unique identifier
 * @returns {string} title - Updated chunk title
 * @returns {string} content - Updated chunk content
 * @returns {number[]} embedding - Updated embedding vector (if content changed)
 * @returns {string} timestamp - Chunk creation timestamp
 * 
 * @example
 * // Request body (content update - triggers embedding regeneration)
 * {
 *   "title": "Updated Special Education Support",
 *   "content": "Haaga-Helia University offers enhanced support services..."
 * }
 * 
 * // Request body (title only update - preserves existing embedding)
 * {
 *   "title": "New Title for Special Education Support"
 * }
 * 
 * // Response
 * {
 *   "id": "chunk_123",
 *   "title": "Updated Special Education Support",
 *   "content": "Haaga-Helia University offers enhanced support services...",
 *   "embedding": [0.1, -0.2, 0.3, ...],
 *   "timestamp": "2024-01-15T10:30:00.000Z"
 * }
 */
router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, content } = req.body;

    // Validate that at least one field is provided for update
    assert(title || content, 400, "Title or content must be provided");

    if (content) {
      // Content changed - regenerate embedding for semantic search accuracy
      const embedding = await getEmbedding(content);
      const chunk = await Chunk.findByIdAndUpdate(
        req.params.id,
        { title, content, embedding },
        { new: true }
      );
      assert(chunk, 404, "Chunk not found");
      return res.json(chunk);
    } else {
      // Only title changed - preserve existing embedding for efficiency
      const chunk = await Chunk.findByIdAndUpdate(
        req.params.id,
        { title, content },
        { new: true }
      );
      assert(chunk, 404, "Chunk not found");
      return res.json(chunk);
    }
  } catch (error) {
    console.error("Error updating chunk:", error);
    return next(error);
  }
});

export default router;
