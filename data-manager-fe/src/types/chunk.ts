// src/types/chunk.ts
// TypeScript-tyypit chunk-tietorakenteille

// Täydellinen chunk-objekti, joka sisältää kaikki tarvittavat tiedot
export interface Chunk {
  id: string; // Yksilöllinen tunniste
  title: string; // Chunkin otsikko/kategoria
  content: string; // Chunkin sisältö (teksti)
  timestamp: string; // Luomisaika ISO-muodossa, esim. "2025-08-26T17:08:16.355Z"
}

// Chunkin muokkauslomakkeelle tarvittavat kentät (ilman id:tä ja timestampia)
export interface EditedChunk {
  title: string; // Muokattava otsikko
  content: string; // Muokattava sisältö
}

// Alias muokattavalle chunkille (lyhenne)
export type EChunk = EditedChunk;

// Chunk-lista tyyppi
export type ChunkList = Chunk[];
