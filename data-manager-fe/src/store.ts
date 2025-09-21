// src/store.ts
// Redux-storen konfiguraatio, joka hallinnoi sovelluksen globaalia tilaa

import { configureStore } from "@reduxjs/toolkit";
import chunkReducer from "./reducer/data-reducer";

// Konfiguroidaan Redux store Redux Toolkit:lla
// Store sisältää chunks-reducerin, joka hallinnoi chunk-tietojen tilaa
const store = configureStore({
  reducer: {
    chunks: chunkReducer, // Chunk-tietojen hallinta (CRUD-operaatiot)
  },
});

// TypeScript-tyypit store:lle
export type RootState = ReturnType<typeof store.getState>; // Store:n koko tila
export type AppDispatch = typeof store.dispatch; // Dispatch-funktio tyypitettynä

export default store;
