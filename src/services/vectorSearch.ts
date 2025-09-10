import { getMultipleEmbeddings } from "./embedding";
import Chunk from "../models/chunk";
import { SearchHits } from "../types/vectorSearchTypes";

export const findInformation = async (
  queries: string[]
): Promise<SearchHits[]> => {
  const embeddings = await getMultipleEmbeddings(queries);

  try {
    const results = await Promise.all(
      embeddings.map(async (embedding) => {
        const agg = [
          {
            $vectorSearch: {
              index: "vector_index",
              path: "embedding",
              queryVector: embedding,
              numCandidates: 10,
              limit: 5,
            },
          },
          {
            $project: {
              _id: 0,
              content: 1,
              score: { $meta: "vectorSearchScore" },
            },
          },
        ];
        return Chunk.aggregate(agg);
      })
    );

    const flat = results.flat().sort((a, b) => b.score - a.score);

    // Poistetaan duplikaatit contentin perusteella
    const seen = new Set<string>();
    const unique = flat.filter((item) => {
      if (seen.has(item.content)) return false;
      seen.add(item.content);
      return true;
    });

    return unique;
  } catch (error) {
    console.error("Error fetching information:", error);
    throw new Error("Error fetching information");
  }
};
