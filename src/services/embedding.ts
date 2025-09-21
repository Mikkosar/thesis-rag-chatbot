import { assert } from "@/utils/assert";
import { openai } from "@ai-sdk/openai";
import { embed, embedMany } from "ai";
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

export const getMultipleEmbeddings = async (
  texts: string[]
): Promise<number[][]> => {
  const { embeddings } = await embedMany({
    model: openai.textEmbeddingModel("text-embedding-3-small"),
    values: texts,
  });
  assert(embeddings, 500, "Multiple embedding generation failed");

  return embeddings;
};
