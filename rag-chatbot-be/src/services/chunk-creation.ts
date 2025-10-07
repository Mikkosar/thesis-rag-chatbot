/**
 * Chunk Creation Service
 * 
 * This module provides AI-powered document chunking functionality for the RAG chatbot
 * system. It uses OpenAI's GPT-4o model to intelligently split long documents into
 * semantically meaningful chunks that are optimal for vector search and retrieval.
 * 
 * The service ensures that chunks maintain semantic coherence while staying within
 * size limits, making them suitable for embedding generation and vector search.
 * 
 * @fileoverview AI-powered document chunking service for knowledge base management
 * @author RAG Chatbot Team
 */

import { assert } from "@/utils/assert";
import { openai } from "@ai-sdk/openai";
import { generateObject, jsonSchema } from "ai";

/**
 * JSON Schema for Chunk Creation Response
 * 
 * Defines the structure of the response from the AI chunking service.
 * The schema ensures that the AI returns an array of text chunks that
 * can be processed and stored in the knowledge base.
 * 
 * @constant {object} chunkCreationSchemaJson
 */
export const chunkCreationSchemaJson = jsonSchema<{
  chunks: string[];
}>({
  type: "object",
  properties: {
    chunks: {
      type: "array",
      items: {
        chunk: "string",
      },
    },
  },
  required: ["chunks"],
});

/**
 * Creates semantically meaningful chunks from long text using AI
 * 
 * This function uses OpenAI's GPT-4o model to intelligently split long documents
 * into coherent, self-contained chunks that are optimal for vector search. The AI
 * ensures that each chunk:
 * - Is semantically coherent and self-contained
 * - Stays within the maximum character limit
 * - Doesn't break sentences or paragraphs mid-way
 * - Contains related information grouped together
 * - Avoids pronoun references that would make chunks dependent on each other
 * 
 * @param {string} text - The long text document to be chunked
 * @returns {Promise<{chunks: string[]}>} Object containing array of text chunks
 * @throws {CustomError} Throws error if chunk creation fails
 * 
 * @example
 * // Chunk a long educational document
 * const result = await createChunks(`
 *   Haaga-Helia University of Applied Sciences offers comprehensive support
 *   services for students with special needs. The university provides...
 *   [long document continues...]
 * `);
 * 
 * console.log("Created", result.chunks.length, "chunks");
 * result.chunks.forEach((chunk, index) => {
 *   console.log(`Chunk ${index + 1}:`, chunk.substring(0, 100) + "...");
 * });
 */
export const createChunks = async (text: string) => {
    const maxChunkSize = 350; // Maximum characters per chunk

    // Use AI to intelligently chunk the text
    const result = await generateObject({
        model: openai("gpt-4o"),
        system: `Ensin muunna teksti selkeiksi ja itsenäisiksi propositioiksi: 
                jokaisen lauseen tulee olla itsenäinen ja ymmärrettävä ilman viittauksia pronomineihin (kuten hän, se, ne), vaan käytä aina tarkkaa viittausta. 
                Tämän jälkeen jaa teksti loogisiin ja semanttisesti yhtenäisiin osiin, joissa kukin osa on korkeintaan ${maxChunkSize} merkkiä pitkä. 
                Älä katkaise virkkeitä tai kappaleita kesken. Sijoita samaan osaan vain sellaiset lauseet, jotka käsittelevät samaa teemaa tai aihepiiriä. 
                Jos aihe muuttuu, aloita uusi osa. Pidä huolta, että jokainen osa muodostaa itsenäisen ja ymmärrettävän kokonaisuuden ilman viittauksia muihin osiin. 
                Varmista, että tärkeää tietoa ei katoa chunkkien rajakohdissa.`,
        schema: chunkCreationSchemaJson,
        prompt: text,
    });

    // Ensure chunk creation was successful
    assert(result && result.object && result.object.chunks, 500, "Failed to create chunks");

    return result.object;
}