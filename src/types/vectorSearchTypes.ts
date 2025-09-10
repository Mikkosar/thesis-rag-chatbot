import z from "zod";

// Yhden vektorihakutuloksen tyyppi
export interface SearchHit {
  content: string;
  score: number;
}
export type SearchHits = SearchHit[];

// Vektorihakukyselyn syötteen zod skeema, voi aiheuttaa ongelmia
export const getInformationInputSchema = z.object({
  queries: z.array(z.string()),
});
