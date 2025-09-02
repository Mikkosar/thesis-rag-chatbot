import { useState } from "react";
import type { Chunk, ChunkList } from "../../types/chunk";
import { useAppDispatch, useAppSelector } from "../../hook";
import { useMatch } from "react-router-dom";
import { editChunk } from "../../reducer/dataReducer";
import { useNavigate } from "react-router-dom";

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
    navigate(`/data/${formData.id}`); // Navigate to the chunk's detail view after saving
  };

  return (
    <div className="container mx-auto max-w-3xl p-6">
      {formData ? (
        <form onSubmit={handleSubmit}>
          <div className="space-y-12">
            <div className="border-b border-white/10 pb-12">
              <h1 className="text-base font-semibold text-black">Muokkaus</h1>

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                {/* Title */}
                <div className="sm:col-span-4">
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-black"
                  >
                    Title:
                  </label>
                  <div className="mt-2">
                    <input
                      name="title"
                      type="text"
                      value={formData.title || ""}
                      onChange={handleChange}
                      className="block w-full rounded-md border border-gray-300 bg-white py-1.5 px-3 text-base text-black placeholder:text-gray-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="sm:col-span-6">
                  <label
                    htmlFor="content"
                    className="block text-sm font-medium text-black"
                  >
                    Content:
                  </label>
                  <div className="mt-2">
                    <textarea
                      name="content"
                      value={formData.content || ""}
                      onChange={handleChange}
                      rows={4}
                      className="block w-full rounded-md border border-gray-300 bg-white py-1.5 px-3 text-base text-black placeholder:text-gray-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-x-6">
              <button
                type="submit"
                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-500"
              >
                Tallenna
              </button>
            </div>
          </div>
        </form>
      ) : (
        <p className="text-black text-center py-10">Loading chunk...</p>
      )}
    </div>
  );
}
