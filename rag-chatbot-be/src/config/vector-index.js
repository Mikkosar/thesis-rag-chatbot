/**
 * MongoDB Atlas Vector Index Configuration
 * 
 * This module creates and configures the MongoDB Atlas Vector Search index
 * required for semantic search functionality in the RAG chatbot system.
 * The vector index enables efficient similarity search across document
 * embeddings stored in the chunks collection.
 * 
 * IMPORTANT: Run this script once before attempting vector search operations
 * using the command: npm run vector-index
 * 
 * The script will:
 * 1. Connect to MongoDB Atlas
 * 2. Create a vector search index on the chunks collection
 * 3. Poll the index status until it's ready for querying
 * 4. Close the database connection
 * 
 * @fileoverview MongoDB Atlas Vector Search index creation and configuration
 */

import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

// MongoDB client instance for database operations
const client = new MongoClient(process.env.MONGO_URI);

/**
 * Creates and configures the MongoDB Atlas Vector Search index
 * 
 * This function performs the following operations:
 * 1. Connects to the MongoDB Atlas database
 * 2. Creates a vector search index on the chunks collection
 * 3. Monitors the index creation process until it's queryable
 * 4. Provides status updates during the process
 * 
 * The vector index configuration:
 * - Name: "vector_index" (referenced in vector search operations)
 * - Dimensions: 1536 (OpenAI text-embedding-3-small model dimensions)
 * - Path: "embedding" field in chunk documents
 * - Similarity: dotProduct (optimal for OpenAI embeddings)
 * - Quantization: scalar (reduces index size while maintaining accuracy)
 * 
 * @async
 * @function run
 * @throws {Error} If database connection or index creation fails
 * 
 * @example
 * // Run this script to create the vector index
 * // Command: node src/config/vector-index.js
 * // Output: Index creation status and readiness confirmation
 */
async function run() {
  try {
    // Connect to the MongoDB Atlas database
    const database = client.db("chatbot-cluster");
    const collection = database.collection("chunks");

    // Define the vector search index configuration
    const index = {
      name: "vector_index",                    // Index name used in search operations
      type: "vectorSearch",                    // MongoDB Atlas vector search type
      definition: {
        fields: [
          {
            type: "vector",                    // Field type for vector search
            numDimensions: 1536,               // OpenAI text-embedding-3-small dimensions
            path: "embedding",                // Field path in chunk documents
            similarity: "dotProduct",          // Similarity metric (optimal for OpenAI)
            quantization: "scalar",           // Quantization method for efficiency
          },
        ],
      },
    };

    // Create the vector search index
    const result = await collection.createSearchIndex(index);
    console.log(`New search index named ${result} is building.`);

    // Monitor index creation progress
    console.log(
      "Polling to check if the index is ready. This may take up to a minute."
    );

    // Poll the index status until it's ready for querying
    let isQueryable = false;
    while (!isQueryable) {
      const cursor = collection.listSearchIndexes();
      
      // Check each index to find our newly created one
      for await (const index of cursor) {
        if (index.name === result) {
          if (index.queryable) {
            // Index is ready for vector search operations
            console.log(`${result} is ready for querying.`);
            isQueryable = true;
          } else {
            // Wait 5 seconds before checking again
            await new Promise((resolve) => setTimeout(resolve, 5000));
          }
        }
      }
    }
  } finally {
    // Always close the database connection
    await client.close();
  }
}

// Execute the index creation process
run().catch(console.dir);
