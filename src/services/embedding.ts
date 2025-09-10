import { assert } from "@/utils/assert";
import { openai } from "@ai-sdk/openai";
import { embed } from "ai";
import dotenv from "dotenv";
dotenv.config();

export const getEmbedding = async (text: string): Promise<number[]> => {
  // Hae tekstin embedding OpenAI:n mallilla
  const { embedding } = await embed({
    model: openai.textEmbeddingModel("text-embedding-3-small"),
    value: text,
  });
  assert(embedding, 500, "Embedding generation failed");

  return embedding;
};
