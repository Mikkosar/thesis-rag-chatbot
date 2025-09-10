import { jsonSchema } from "ai";
import z from "zod";

// Skeemat työkalun syötteelle ja optimoinnin tulokselle

export const toolOptimazationSchemaZod = z.object({
  queries: z.array(z.string()).min(1).max(3),
});

export const toolInputSchemaZod = z.object({
  query: z.string().describe("Käyttäjän kysymys ja aikaisempi keskustelu"),
});

// Nämä on sitä varten jos Zodin kanssa tulee ongelmia:
export const toolOptionSchemaJson = jsonSchema<{
  queries: string[];
}>({
  type: "object",
  properties: {
    queries: {
      type: "array",
      items: {
        type: "string",
      },
    },
  },
  required: ["queries"],
});

export const toolInputSchemaJson = jsonSchema<{
  query: string;
}>({
  type: "object",
  properties: {
    query: {
      type: "string",
      description: "Käyttäjän kysymys ja aikaisempi keskustelu",
    },
  },
  required: ["query"],
  additionalProperties: false,
});
