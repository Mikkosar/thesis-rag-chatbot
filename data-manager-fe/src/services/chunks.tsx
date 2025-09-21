// src/services/chunks.tsx
// API-palvelut chunk-tietojen hallintaan palvelimella

import axios from "axios";
import type { EChunk } from "../types/chunk";

// Palvelimen perus-URL ympäristömuuttujasta
const baseURL = import.meta.env.VITE_BASE_URL;

// Hakee kaikki chunkit palvelimelta
const getAllChunks = async () => {
  try {
    const res = await axios.get(`${baseURL}/chunk`);
    return res.data;
  } catch (error) {
    console.error("Error fetching chunks:", error);
    throw error;
  }
};

// Muokkaa olemassa olevaa chunkia palvelimella
const editChunk = async (chunkId: string, updatedData: EChunk) => {
  try {
    const res = await axios.put(`${baseURL}/chunk/${chunkId}`, updatedData);
    return res.data;
  } catch (error) {
    console.error("Error editing chunk:", error);
    throw error;
  }
};

// Poistaa chunkin palvelimelta
const deleteChunk = async (chunkId: string) => {
  try {
    const res = await axios.delete(`${baseURL}/chunk/${chunkId}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting chunk:", error);
    throw error;
  }
};

// Luo uuden chunkin palvelimelle
const createChunk = async (newData: EChunk) => {
  try {
    const res = await axios.post(`${baseURL}/chunk`, newData);
    return res.data;
  } catch (error) {
    console.error("Error creating chunk:", error);
    throw error;
  }
};

// Luo useita chunkeja AI:n avulla yhdestä tekstistä
const createMultipleChunks = async (text: string) => {
  try {
    const res = await axios.post(`${baseURL}/chunk/multiple`, { text });
    return res.data;
  } catch (error) {
    console.error("Error creating multiple chunks:", error);
    throw error;
  }
};

// Exportataan kaikki palvelufunktiot
export default { getAllChunks, editChunk, deleteChunk, createChunk, createMultipleChunks };
