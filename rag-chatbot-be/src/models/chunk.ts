/**
 * Chunk Model
 * 
 * This module defines the Chunk data model for the RAG (Retrieval-Augmented Generation)
 * system. Chunks represent segmented pieces of institutional knowledge that are
 * embedded as vectors for semantic search functionality.
 * 
 * Each chunk contains educational content with vector embeddings that enable
 * the chatbot to retrieve relevant information based on user queries.
 * 
 * @fileoverview Knowledge base chunk data model and schema definition
 */

import mongoose from "mongoose";
const { Schema } = mongoose;

/**
 * Chunk Schema Definition
 * 
 * Defines the MongoDB schema for Chunk documents that store institutional
 * knowledge in segmented format with vector embeddings for semantic search.
 * 
 * Each chunk represents a meaningful piece of educational content that can
 * be retrieved and used to augment AI responses with relevant information.
 */
const ChunkSchema = new Schema({
  /** Title or heading of the knowledge chunk */
  title: { type: String, required: true },
  
  /** The actual content/text of the knowledge chunk */
  content: { type: String, required: true },
  
  /** Vector embedding array for semantic search functionality */
  embedding: {
    type: [Number],
    required: true,
  },
  
  /** Timestamp when the chunk was created/added to the knowledge base */
  timestamp: { type: Date, default: Date.now },
});

/**
 * JSON Transformation
 * 
 * Customizes the JSON output format for Chunk documents:
 * - Converts MongoDB's _id to id for frontend compatibility
 * - Removes internal MongoDB fields (_id, __v) from JSON output
 * - Ensures clean API responses without internal database metadata
 */
ChunkSchema.set("toJSON", {
  transform: (_document, returnedObject: any) => {
    returnedObject.id = returnedObject._id.toString();
    delete (returnedObject as any)._id;
    delete (returnedObject as any).__v;
  },
});

/**
 * Chunk Model Export
 * 
 * Creates and exports the Mongoose model for Chunk documents.
 * This model provides database operations for knowledge base management
 * and vector search functionality.
 */
const Chunk = mongoose.model("Chunk", ChunkSchema);
export default Chunk;
