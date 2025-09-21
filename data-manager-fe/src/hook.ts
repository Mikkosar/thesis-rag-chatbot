// src/hook.ts
// TypeScript-tyypitetyt Redux-hookit, jotka varmistavat tyyppiturvallisuuden

import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";
import type { TypedUseSelectorHook } from "react-redux";

// Tyypitetty dispatch-hook, joka palauttaa AppDispatch-tyypin
// Mahdollistaa Redux-aktioiden lähettämisen tyyppiturvallisesti
export const useAppDispatch = () => useDispatch<AppDispatch>();

// Tyypitetty selector-hook, joka palauttaa RootState-tyypin
// Mahdollistaa store:n tilan lukemisen tyyppiturvallisesti
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
