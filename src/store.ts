import { configureStore } from "@reduxjs/toolkit";
import chunkReducer from "./reducer/dataReducer";

const store = configureStore({
  reducer: {
    chunks: chunkReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
