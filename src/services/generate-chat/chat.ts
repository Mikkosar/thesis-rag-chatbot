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
Ota nämä käyttöön jos Zod aiheuttaa ongelmia:
import { toolInputSchemajson, toolOptimazationSchemajson } from "@/types/aiGenTypes";
*/

export const getChatCompeletion = async (messages: IChatMessages) => {
  try {
    // Generoidaan vastaus käyttäen AI-mallia ja työkaluja
    const result = await generateText({
      model: openai("gpt-4o"),
      system: chatBotSystemPrompt,
      tools: {
        // Työkalu, joka laajentaa kysymyksen useiksi muunnelmiksi ja hakee tietoa kaikilla niillä
        expandAndSearch: tool<{ query: string }, SearchHits[]>({
          description:
            "Laajenna kysymys useiksi muunnelmiksi ja hae tietoa kaikilla niillä.",
          inputSchema: toolInputSchemaZod,
          execute: async ({ query }) => {
            // Generoi useita kysymyksiä alkuperäisestä kysymyksestä
            const {
              object: { queries },
            } = await generateObject({
              model: openai("gpt-4o"),
              schema: toolOptimazationSchemaZod,
              prompt: `Luo seuraavasta kysymyksestä 3:\n\n${query}`,
            });

            // Hae tietoa kaikilla generoituilla kysymyksillä
            const results = await findInformation(queries);
            console.log("expandAndSearch results:", results);
            return results;
          },
        }),
      },
      // Rajoittaa maksimissaan 2 työkalun kutsuun
      stopWhen: stepCountIs(3),
      messages: messages,
    });
    return result;
  } catch (error) {
    console.error("Error generating chat completion:", error);
    assert(false, 500, "Error generating chat completion");
  }
};
