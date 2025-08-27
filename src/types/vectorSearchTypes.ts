import { jsonSchema } from "ai";

/** Yhden hakutuloksen tyyppi */
export interface SearchHit {
  content: string;
  score: number;
}
/** Taulukko hakutuloksista */
export type SearchHits = SearchHit[];

export interface GetInformationInput {
  query: string;
}

export const getInformationInputSchema = jsonSchema<GetInformationInput>({
  type: "object",
  properties: {
    query: {
      type: "string",
      description: "Käyttäjän kysymys",
    },
  },
  required: ["query"],
});
