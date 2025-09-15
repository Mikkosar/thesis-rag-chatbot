import { useState } from "react";
import type { Chunk, ChunkList } from "../../types/chunk";
import { useAppDispatch, useAppSelector } from "../../hook";
import { useMatch } from "react-router-dom";
import { editChunk } from "../../reducer/dataReducer";
import { useNavigate } from "react-router-dom";
import Button from "../button";
import Header from "./dataComponents/dataHeaders";
import EditData from "./dataComponents/editData";

export default function DataForm() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const chunks: ChunkList = useAppSelector((state) =>
    Array.isArray(state.chunks) ? state.chunks : []
  );
  const findChunkById = (id: string) =>
    chunks.find((chunk: Chunk) => chunk.id === id);

  const match = useMatch("/edit/:id");
  const chunk =
    match && match.params.id ? findChunkById(match.params.id) : undefined;

  const [formData, setFormData] = useState<Partial<Chunk> | undefined>(chunk);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Tallennetaan:", formData);
    if (!formData || !formData.id) {
      console.error("Form data is incomplete or missing ID.");
      return;
    }
    dispatch(
      editChunk(chunk!.id, {
        title: formData!.title!,
        content: formData!.content!,
      })
    );
    navigate(`/data/${formData.title}`); // Navigate to the chunk's detail view after saving
  };

  return (
    <div className="container mx-auto max-w-3xl p-6">
      {formData ? (
        <form onSubmit={handleSubmit}>
          <div className="space-y-12">
            <div className="space-y-8 bg-white/5 p-8 rounded-2xl shadow-2xl">
              <div className="border-b border-white/10 pb-5 flex flex-col">
                <Header title="Muokkaus" />
                <EditData
                  title={formData.title || ""}
                  content={formData.content || ""}
                  onChange={handleChange}
                />
              </div>
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
