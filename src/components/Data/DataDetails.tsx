import { useMatch, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hook";
import type { Chunk, ChunkList } from "../../types/chunk";
import { deleteChunk } from "../../reducer/dataReducer";

export default function DataForm() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const chunks: ChunkList = useAppSelector((state) => state.chunks ?? []);
  const findChunkById = (id: string) =>
    chunks.find((chunk: Chunk) => chunk.id === id);

  const match = useMatch("/data/:id");
  const chunk =
    match && match.params.id ? findChunkById(match.params.id) : undefined;

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
      {chunk ? (
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base/7 font-semibold text-black">
              {chunk.title}
            </h2>
          </div>
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
              <p className="mt-1 text-sm text-black">{chunk.timestamp}</p>
            </div>
          </div>

          <div className="border-b border-gray-900/10 pb-12">
            <button
              onClick={() => handleEdit(chunk.id)}
              className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-blue-500"
            >
              Muokkaa
            </button>
          </div>

          <div className="border-b border-gray-900/10 pb-12">
            <button
              onClick={() => handleDelete(chunk.id)}
              className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-blue-500"
            >
              Poista
            </button>
          </div>
        </div>
      ) : (
        <p className="text-black text-center py-10">Loading chunk...</p>
      )}
    </div>
  );
}
