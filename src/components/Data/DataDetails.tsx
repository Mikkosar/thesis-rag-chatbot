import { useMatch, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hook";
import type { Chunk, ChunkList } from "../../types/chunk";
import { deleteChunk } from "../../reducer/dataReducer";

export default function DataForm() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const allChunks: ChunkList = useAppSelector((state) => state.chunks ?? []);

  const match = useMatch("/data/:title");

  const findChunksByTitle = (title: string) =>
    allChunks.filter((chunk: Chunk) => chunk.title === title);

  const chunks: ChunkList =
    match && match.params.title ? findChunksByTitle(match.params.title) : [];

  const handleEdit = (id: string) => {
    navigate(`/edit/${id}`);
  };

  const handleDelete = (id: string) => {
    console.log("Deleting chunk with id:", id);
    dispatch(deleteChunk(id));
    navigate("/");
  };

  return (
    <div className="container mx-auto max-w-3xl p-6">
      {chunks.length > 0 ? (
        chunks.map((chunk: Chunk, idx) => (
          <div className="space-y-12" key={idx}>
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
              <div className="sm:col-span-1">
                <label
                  htmlFor="content"
                  className="block text-sm font-medium text-black"
                >
                  Content:
                </label>
              </div>
              <div className="sm:col-span-5">
                <p className="mt-1 text-sm text-black">{chunk.content}</p>
              </div>

              <div className="sm:col-span-1">
                <label
                  htmlFor="createdAt"
                  className="block text-sm font-medium text-black"
                >
                  Created At:
                </label>
              </div>
              <div className="sm:col-span-5">
                <p className="mt-1 text-sm text-black">
                  {new Date(chunk.timestamp).toLocaleString("fi-FI")}
                </p>
              </div>
            </div>

            <div className="border-b border-gray-900/10 pb-12 space-x-10">
              <button
                onClick={() => handleEdit(chunk.id)}
                className="rounded-md bg-black-600 px-3 py-1.5 text-sm font-medium text-black shadow-sm hover:bg-gray-300 transition"
              >
                Muokkaa
              </button>
              <button
                onClick={() => handleDelete(chunk.id)}
                className="rounded-md bg-black-600 px-3 py-1.5 text-sm font-medium text-black shadow-sm hover:bg-red-300 transition"
              >
                Poista
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-black text-center py-10">Loading chunk...</p>
      )}
    </div>
  );
}
