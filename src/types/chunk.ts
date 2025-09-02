export interface Chunk {
  id: string;
  title: string;
  content: string;
  timestamp: string; // ISO string, esim. "2025-08-26T17:08:16.355Z"
}

export interface EditedChunk {
  title: string;
  content: string;
}

export type EChunk = EditedChunk;
export type ChunkList = Chunk[];
