/**
 * Chat Generation Service
 * 
 * This module provides the core chat generation functionality for the RAG chatbot system.
 * It integrates OpenAI's GPT-4o model with custom tools to enable retrieval-augmented
 * generation, allowing the chatbot to access and utilize institutional knowledge
 * from the vector search system.
 * 
 * The service implements a sophisticated query expansion and search mechanism that
 * enhances the chatbot's ability to find relevant information by generating multiple
 * query variations and searching the knowledge base with each variation.
 * 
 * Key features:
 * - OpenAI GPT-4o integration with custom system prompt
 * - Query expansion tool for improved information retrieval
 * - Vector search integration for knowledge base access
 * - Step-limited execution to prevent excessive API calls
 * 
 * @fileoverview Core chat generation service with RAG capabilities
 */

import { openai } from "@ai-sdk/openai";
import { generateText, tool, stepCountIs, generateObject } from "ai";
import { SearchHits } from "../../types/vector-search-types";
import "dotenv/config";
import { findInformation } from "../vector-search";
import type { IChatMessages } from "@/types/chat-log-types";
import { assert } from "@/utils/assert";
import {
  toolInputSchemaZod,
  toolOptimazationSchemaZod,
} from "@/types/ai-gen-types";
import { chatBotSystemPrompt } from "@/types/ai-prompts";

/*
 * Fallback imports for JSON schema validation if Zod causes issues:
 * import { toolInputSchemajson, toolOptimazationSchemajson } from "@/types/aiGenTypes";
 */

/**
 * Generates AI chat completion with retrieval-augmented generation capabilities
 * 
 * This function creates a sophisticated chat response by combining OpenAI's GPT-4o
 * model with custom tools that enable the chatbot to search and retrieve relevant
 * information from the institutional knowledge base. The system uses query expansion
 * to improve search accuracy and provides contextually relevant responses.
 * 
 * The process involves:
 * 1. Receiving user messages and conversation context
 * 2. Using GPT-4o with custom tools to expand queries and search knowledge base
 * 3. Retrieving relevant information through vector search
 * 4. Generating contextual responses based on retrieved information
 * 5. Limiting tool usage to prevent excessive API calls
 * 
 * @param {IChatMessages} messages - Array of conversation messages including user input
 * @returns {Promise<Object>} AI-generated response with text and tool usage information
 * @throws {CustomError} Throws error if chat generation fails
 * 
 * const response = await getChatCompeletion(messages);
 * console.log("AI Response:", response.text);
 * console.log("Tool Usage:", response.toolCalls);
 */
export const getChatCompeletion = async (messages: IChatMessages) => {
  try {
    // Generate AI response using GPT-4o model with custom tools
    const result = await generateText({
      model: openai("gpt-4o"),                    // OpenAI's most capable model
      system: chatBotSystemPrompt,                // Custom system prompt for educational support
      tools: {
        // Query expansion and search tool for enhanced information retrieval
        expandAndSearch: tool<{ query: string }, SearchHits[]>({
          description:
            "Laajenna kysymys useiksi muunnelmiksi ja hae tietoa kaikilla niillä.",
          inputSchema: toolInputSchemaZod,        // Zod schema for input validation
          execute: async ({ query }) => {
            // Generate multiple query variations from the original question
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
      messages: messages,                         // Conversation context and user input
    });
    
    return result;
  } catch (error) {
    console.error("Error generating chat completion:", error);
    assert(false, 500, "Error generating chat completion");
  }
};
