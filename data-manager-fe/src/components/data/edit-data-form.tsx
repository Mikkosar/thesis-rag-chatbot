// src/components/data/edit-data-form.tsx
// Lomake olemassa olevan chunkin muokkaamiseen

import { useState } from "react";
import type { Chunk, ChunkList } from "../../types/chunk";
import { useAppDispatch, useAppSelector } from "../../hook";
import { useMatch } from "react-router-dom";
import { editChunk } from "../../reducer/data-reducer";
import { useNavigate } from "react-router-dom";
import Button from "../button";
import Header from "./data-components/dataHeaders";
import EditData from "./data-components/editData";

export default function DataForm() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Haetaan kaikki chunkit Redux storesta
  const chunks: ChunkList = useAppSelector((state) =>
    Array.isArray(state.chunks) ? state.chunks : []
  );
  
  // Etsii chunkin ID:n perusteella
  const findChunkById = (id: string) =>
    chunks.find((chunk: Chunk) => chunk.id === id);

  // Haetaan URL-parametrit (chunkin ID)
  const match = useMatch("/edit/:id");
  const chunk =
    match && match.params.id ? findChunkById(match.params.id) : undefined;

  // Lomakkeen tila, alustetaan löydetyn chunkin tiedoilla
  const [formData, setFormData] = useState<Partial<Chunk> | undefined>(chunk);

  // Käsittelee lomakkeen kenttien muutokset
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Käsittelee lomakkeen lähettämisen
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Tallennetaan:", formData);
    
    // Tarkistetaan että pakolliset kentät on täytetty
    if (!formData || !formData.id) {
      console.error("Form data is incomplete or missing ID.");
      return;
    }
    
    // Päivitetään chunk Redux storeen
    dispatch(
      editChunk(chunk!.id, {
        title: formData!.title!,
        content: formData!.content!,
      })
    );
    // Siirrytään chunkin tietosivulle tallennuksen jälkeen
    navigate(`/data/${formData.title}`);
  };

  return (
    <div className="container mx-auto max-w-3xl p-6">
      {formData ? (
        <form onSubmit={handleSubmit}>
          <div className="space-y-12">
            <div className="space-y-8 bg-white/5 p-8 rounded-2xl shadow-2xl">
              <div className="border-b border-white/10 pb-5 flex flex-col">
                {/* Lomakkeen otsikko */}
                <Header title="Muokkaus" />
                {/* Muokkaus-kentät */}
                <EditData
                  title={formData.title || ""}
                  content={formData.content || ""}
                  onChange={handleChange}
                />
              </div>
              {/* Tallennuspainike */}
              <div className="mt-2 flex items-center justify-center">
                <Button type="submit" text="Tallenna" color="green" />
              </div>
            </div>
          </div>
        </form>
      ) : (
        <p className="text-black text-center py-10">Loading chunk...</p>
      )}
    </div>
  );
}
