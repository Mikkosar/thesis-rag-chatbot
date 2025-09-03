import { getEmbedding } from "./embedding";
import Chunk from "../models/chunk";
import { SearchHits } from "../types/vectorSearchTypes";

export const findInformation = async (
  latestQuery: string
): Promise<SearchHits> => {
  console.log("Finding information for query:", latestQuery);
  const embedding = await getEmbedding(latestQuery);
  try {
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
          score: {
            $meta: "vectorSearchScore",
          },
        },
      },
    ];
    const result = await Chunk.aggregate(agg);
    return result;
  } catch (error) {
    console.error("Error fetching information:", error);
    throw new Error("Error fetching information");
  }
};
