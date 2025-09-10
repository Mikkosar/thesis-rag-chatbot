import {
  streamText,
  tool,
  stepCountIs,
  generateObject,
  UIMessage,
  convertToModelMessages,
} from "ai";
import { openai } from "@ai-sdk/openai";
import { SearchHits } from "../../types/vectorSearchTypes";

//import z from "zod";
import { findInformation } from "../vectorSearch";
import { chatBotSystemPrompt } from "@/types/aiPrompts";
import { assert } from "@/utils/assert";
import {
  toolInputSchemaZod,
  toolOptimazationSchemaZod,
} from "@/types/aiGenTypes";

/*
Ota nämä käyttöön jos Zod aiheuttaa ongelmia:
import { toolInputSchemajson, toolOptimazationSchemajson } from "@/types/aiGenTypes";
*/

export const getStreamText = async (messages: UIMessage[]) => {
  try {
    // Generoidaan stream vastaus käyttäen AI-mallia ja työkaluja
    const result = streamText({
      model: openai("gpt-4o"),
      messages: convertToModelMessages(messages),
      onFinish: () => {
        console.log("Streaming finished.");
      },
      system: chatBotSystemPrompt,
      tools: {
        // Työkalu, joka laajentaa kysymyksen useiksi muunnelmiksi ja hakee tietoa kaikilla niillä

        expandAndSearch: tool<{ query: string }, SearchHits[]>({
          name: "expandAndSearch",
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
    });
    return result;
  } catch (error) {
    console.error("Error generating chat completion:", error);
    assert(false, 500, "Error generating chat completion");
  }
};
