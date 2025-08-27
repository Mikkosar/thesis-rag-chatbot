import { getEmbedding } from "./embedding";
import Chunk from "../models/chunk";
import { SearchHits } from "../types/vectorSearchTypes";

export const findInformation = async (
  latestQuery: string
): Promise<SearchHits> => {
  const embedding = await getEmbedding(latestQuery);
  try {
    const agg = [
      {
        $vectorSearch: {
          index: "vector_index",
          path: "embedding",
          queryVector: embedding,
          numCandidates: 5,
          limit: 3,
        },
      },
      {
        $project: {
          _id: 0,
          content: 1,
          score: {
            $meta: "vectorSearchScore",
          },
        },
      },
    ];
    const result = await Chunk.aggregate(agg);
    console.log("2. Tieto haettu tietokannasta:", result);
    return result;
  } catch (error) {
    console.error("Error fetching information:", error);
    throw new Error("Error fetching information");
  }
};
