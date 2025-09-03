import z from "zod";

export interface SearchHit {
  content: string;
  score: number;
}

export type SearchHits = SearchHit[];

export interface GetInformationInput {
  query: string;
}

export const getInformationInputSchema = z.object({
  queries: z.array(z.string()),
});
