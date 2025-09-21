// src/components/data/data-details.tsx
// Sivu, joka näyttää tietyn otsikon chunkit ja mahdollistaa niiden muokkaamisen/poistamisen

import { useMatch, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hook";
import type { Chunk, ChunkList } from "../../types/chunk";
import { deleteChunk } from "../../reducer/data-reducer";
import DataDetails from "./data-components/dataDetails";
import Button from "../button";

export default function DataForm() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  // Haetaan kaikki chunkit Redux storesta
  const allChunks: ChunkList = useAppSelector((state) => state.chunks ?? []);

  // Haetaan URL-parametrit (otsikko)
  const match = useMatch("/data/:title");

  // Etsii chunkit otsikon perusteella
  const findChunksByTitle = (title: string) =>
    allChunks.filter((chunk: Chunk) => chunk.title === title);

  // Filtteröidään chunkit URL-parametrin perusteella
  const chunks: ChunkList =
    match && match.params.title ? findChunksByTitle(match.params.title) : [];

  // Siirtyy chunkin muokkaussivulle
  const handleEdit = (id: string) => {
    navigate(`/edit/${id}`);
  };

  // Poistaa chunkin ja palaa takaisin
  const handleDelete = (id: string) => {
    console.log("Deleting chunk with id:", id);
    dispatch(deleteChunk(id));
    navigate("/");
  };

  return (
    <div className="container mx-auto max-w-3xl p-6">
      {/* Takaisin-painike */}
      <Button text="Takaisin" onClick={() => navigate(-1)} />
      
      {/* Chunk-lista tai latausviesti */}
      {chunks.length > 0 ? (
        chunks.map((chunk: Chunk, idx) => (
          <div className="space-y-12" key={idx}>
            {/* Chunkin sisältö ja aikaleima */}
            <DataDetails content={chunk.content} timestamp={chunk.timestamp} />
            {/* Toimintopainikkeet */}
            <div className="border-b border-gray-900/10 pb-12 space-x-10">
              <Button text="Muokkaa" onClick={() => handleEdit(chunk.id)} />
              <Button text="Poista" onClick={() => handleDelete(chunk.id)} color="red"/>
            </div>
          </div>
        ))
      ) : (
        <p className="text-black text-center py-10">Loading chunk...</p>
      )}
    </div>
  );
}
