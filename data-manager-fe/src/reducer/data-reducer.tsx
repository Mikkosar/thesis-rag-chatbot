// src/reducer/data-reducer.tsx
// Redux-slice chunk-tietojen hallintaan, sisältää CRUD-operaatiot ja asynkroniset thunkit

import { createSlice } from "@reduxjs/toolkit";
import chunkService from "../services/chunks";
import type { PayloadAction, Dispatch } from "@reduxjs/toolkit";
import type { Chunk, ChunkList, EChunk } from "../types/chunk";

// Alkuperäinen tila: tyhjä chunk-lista
const initialState: ChunkList = [];

// Redux slice chunk-tietojen hallintaan
const chunksSlice = createSlice({
  name: "chunks",
  initialState,
  reducers: {
    // Asettaa koko chunk-listan (käytetään alustuksessa)
    setChunks: (_state, action: PayloadAction<Chunk[]>) => {
      return action.payload;
    },
    // Lisää uuden chunkin listaan
    appendChunk: (state, action: PayloadAction<Chunk>) => {
      state.push(action.payload);
    },
    // Päivittää olemassa olevan chunkin tiedot
    updateChunkInState: (state, action: PayloadAction<Chunk>) => {
      const index = state.findIndex(
        (chunk: Chunk) => chunk.id === action.payload.id
      );
      if (index !== -1) {
        state[index] = action.payload;
      }
    },
    // Poistaa chunkin listasta ID:n perusteella
    removeChunkFromState: (state, action: PayloadAction<string>) => {
      return state.filter((chunk: Chunk) => chunk.id !== action.payload);
    },
  },
});

// Exportataan action-kreatorit
export const {
  setChunks,
  appendChunk,
  updateChunkInState,
  removeChunkFromState,
} = chunksSlice.actions;

// Asynkroninen thunk: hakee kaikki chunkit palvelimelta ja asettaa ne storeen
export const initializeChunks = () => {
  return async (dispatch: Dispatch) => {
    console.log("Initializing chunks...");
    const allChunks = await chunkService.getAllChunks();
    console.log("Fetched chunks:", allChunks);
    dispatch(setChunks(allChunks));
  };
};

// Asynkroninen thunk: luo uuden chunkin (paikallinen versio)
export const createChunk = (chunk: Chunk) => {
  return async (dispatch: Dispatch) => {
    console.log("Creating chunk:", chunk);
    dispatch(appendChunk(chunk));
  };
};

// Asynkroninen thunk: muokkaa olemassa olevaa chunkia
export const editChunk = (chunkId: string, updatedData: EChunk) => {
  return async (dispatch: Dispatch) => {
    console.log("Editing chunk:", chunkId, updatedData);
    const updatedChunk = await chunkService.editChunk(chunkId, updatedData);
    console.log("Updated chunk:", updatedChunk);
    dispatch(updateChunkInState(updatedChunk));
  };
};

// Asynkroninen thunk: poistaa chunkin palvelimelta ja storesta
export const deleteChunk = (chunkId: string) => {
  return async (dispatch: Dispatch) => {
    console.log("Deleting chunk:", chunkId);
    await chunkService.deleteChunk(chunkId);
    dispatch(removeChunkFromState(chunkId));
  };
};

// Asynkroninen thunk: luo uuden chunkin palvelimelle ja lisää sen storeen
export const createNewChunk = (newData: EChunk) => {
  return async (dispatch: Dispatch) => {
    console.log("Creating new chunk with data:", newData);
    const createdChunk = await chunkService.createChunk(newData);
    console.log("Created chunk:", createdChunk);
    dispatch(appendChunk(createdChunk));
  };
};

export default chunksSlice.reducer;
