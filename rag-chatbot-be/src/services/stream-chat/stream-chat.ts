/**
 * Streaming Chat Service
 * 
 * This module provides real-time streaming chat functionality for the RAG chatbot system.
 * It implements streaming text generation using OpenAI's GPT-4o model with custom tools
 * for retrieval-augmented generation, enabling real-time conversation flow while
 * maintaining access to institutional knowledge through vector search.
 * 
 * The service combines streaming capabilities with RAG functionality, allowing users
 * to receive AI responses in real-time while the system searches and retrieves relevant
 * information from the knowledge base. This provides an enhanced user experience with
 * immediate feedback and contextually relevant responses.
 * 
 * Key features:
 * - Real-time streaming text generation
 * - OpenAI GPT-4o integration with custom system prompt
 * - Query expansion and vector search tools
 * - Step-limited execution to prevent excessive API calls
 * - Streaming completion callbacks
 * 
 * @fileoverview Real-time streaming chat service with RAG capabilities
 */

import {
  streamText,
  tool,
  stepCountIs,
  generateObject,
  UIMessage,
  convertToModelMessages,
} from "ai";
import { openai } from "@ai-sdk/openai";
import { SearchHits } from "../../types/vector-search-types";

//import z from "zod";
import { findInformation } from "../vector-search";
import { chatBotSystemPrompt } from "@/types/ai-prompts";
import { assert } from "@/utils/assert";
import {
  toolInputSchemaZod,
  toolOptimazationSchemaZod,
} from "@/types/ai-gen-types";

/*
Fallback imports for JSON schema validation if Zod causes issues:
import { toolInputSchemajson, toolOptimazationSchemajson } from "@/types/aiGenTypes";
*/

/**
 * Generates streaming AI chat responses with retrieval-augmented generation capabilities
 * 
 * This function creates real-time streaming chat responses by combining OpenAI's GPT-4o
 * model with custom tools that enable the chatbot to search and retrieve relevant
 * information from the institutional knowledge base. The streaming approach provides
 * immediate user feedback while maintaining RAG functionality.
 * 
 * The process involves:
 * 1. Receiving UIMessage format conversation context
 * 2. Converting messages to model format for OpenAI processing
 * 3. Using GPT-4o with custom tools for query expansion and knowledge base search
 * 4. Streaming responses in real-time to the user
 * 5. Limiting tool usage to prevent excessive API calls and costs
 * 
 * @param {UIMessage[]} messages - Array of conversation messages in UIMessage format
 * @returns {Promise<Object>} Streaming text result with real-time response generation
 * @throws {CustomError} Throws error if streaming generation fails
*/
export const getStreamText = async (messages: UIMessage[]) => {
  try {
    // Generate streaming response using AI model and custom tools
    const result = streamText({
      model: openai("gpt-4o"),                    // OpenAI's most capable model for streaming
      messages: convertToModelMessages(messages), // Convert UIMessage format to model format
      onFinish: () => {
        // Callback executed when streaming completes
        console.log("Streaming finished.");
      },
      system: chatBotSystemPrompt,                // Custom system prompt for educational support
      tools: {
        // Tool that expands questions into multiple variations and searches with all of them
        expandAndSearch: tool<{ query: string }, SearchHits[]>({
          name: "expandAndSearch",
          description:
            "Laajenna kysymys useiksi muunnelmiksi ja hae tietoa kaikilla niillä.",
          inputSchema: toolInputSchemaZod,        // Zod schema for input validation
          execute: async ({ query }) => {
            // Generate multiple question variations from the original question
            // This improves search accuracy by covering different phrasings and aspects
            const {
              object: { queries },
            } = await generateObject({
              model: openai("gpt-4o"),            // Use GPT-4o for query expansion
              schema: toolOptimazationSchemaZod,   // Schema for query optimization
              prompt: `Luo seuraavasta kysymyksestä 3:\n\n${query}`,
            });

            // Search knowledge base with all generated query variations
            // This ensures comprehensive information retrieval
            const results = await findInformation(queries);
            console.log("expandAndSearch results:", results);
            return results;
          },
        }),
      },
      // Limit maximum tool calls to prevent excessive API usage and costs
      stopWhen: stepCountIs(3),
    });
    return result;
  } catch (error) {
    console.error("Error generating chat completion:", error);
    assert(false, 500, "Error generating chat completion");
  }
};
