import { createSlice } from "@reduxjs/toolkit";
import chunkService from "../services/chunks";
import type { PayloadAction, Dispatch } from "@reduxjs/toolkit";
import type { Chunk, ChunkList, EChunk } from "../types/chunk";

const initialState: ChunkList = [];

const chunksSlice = createSlice({
  name: "chunks",
  initialState,
  reducers: {
    setChunks: (_state, action: PayloadAction<Chunk[]>) => {
      return action.payload;
    },
    appendChunk: (state, action: PayloadAction<Chunk>) => {
      state.push(action.payload);
    },
    updateChunkInState: (state, action: PayloadAction<Chunk>) => {
      const index = state.findIndex(
        (chunk: Chunk) => chunk.id === action.payload.id
      );
      if (index !== -1) {
        state[index] = action.payload;
      }
    },
    removeChunkFromState: (state, action: PayloadAction<string>) => {
      return state.filter((chunk: Chunk) => chunk.id !== action.payload);
    },
  },
});

export const {
  setChunks,
  appendChunk,
  updateChunkInState,
  removeChunkFromState,
} = chunksSlice.actions;

export const initializeChunks = () => {
  return async (dispatch: Dispatch) => {
    console.log("Initializing chunks...");
    const allChunks = await chunkService.getAllChunks();
    console.log("Fetched chunks:", allChunks);
    dispatch(setChunks(allChunks));
  };
};

export const createChunk = (chunk: Chunk) => {
  return async (dispatch: Dispatch) => {
    console.log("Creating chunk:", chunk);
    dispatch(appendChunk(chunk));
  };
};

export const editChunk = (chunkId: string, updatedData: EChunk) => {
  return async (dispatch: Dispatch) => {
    console.log("Editing chunk:", chunkId, updatedData);
    const updatedChunk = await chunkService.editChunk(chunkId, updatedData);
    console.log("Updated chunk:", updatedChunk);
    dispatch(updateChunkInState(updatedChunk));
  };
};

export const deleteChunk = (chunkId: string) => {
  return async (dispatch: Dispatch) => {
    console.log("Deleting chunk:", chunkId);
    await chunkService.deleteChunk(chunkId);
    dispatch(removeChunkFromState(chunkId));
  };
};

export const createNewChunk = (newData: EChunk) => {
  return async (dispatch: Dispatch) => {
    console.log("Creating new chunk with data:", newData);
    const createdChunk = await chunkService.createChunk(newData);
    console.log("Created chunk:", createdChunk);
    dispatch(appendChunk(createdChunk));
  };
};

export default chunksSlice.reducer;
