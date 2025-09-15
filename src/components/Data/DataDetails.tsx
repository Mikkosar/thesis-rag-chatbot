import { useMatch, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hook";
import type { Chunk, ChunkList } from "../../types/chunk";
import { deleteChunk } from "../../reducer/dataReducer";
import DataDetails from "./dataComponents/dataDetails";
import Button from "../button";

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
      <Button text="Takaisin" onClick={() => navigate(-1)} />
      {chunks.length > 0 ? (
        chunks.map((chunk: Chunk, idx) => (
          <div className="space-y-12" key={idx}>
            <DataDetails content={chunk.content} timestamp={chunk.timestamp} />
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
