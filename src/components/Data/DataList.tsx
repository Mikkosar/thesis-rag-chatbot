import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../hook";
import type { Chunk } from "../../types/chunk";

export default function DataList() {
  const chunks = useAppSelector((state) => state.chunks ?? []);

  const navigate = useNavigate();

  const handleShowMore = (id: string) => {
    navigate(`/data/${id}`);
  };

  const handleCreate = () => {
    navigate(`/create`);
  };

  return (
    <div className="container mx-auto max-w-3xl p-6">
      <button
        onClick={() => handleCreate()}
        className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-blue-500"
      >
        Luo +
      </button>
      {chunks && chunks.length > 0 ? (
        <ul role="list" className="divide-y divide-gray-700">
          {chunks.map((chunk: Chunk) => (
            <li key={chunk.id} className="flex justify-between gap-x-6 py-5">
              <div className="min-w-0 flex-auto flex flex-col">
                <p className="text-sm font-semibold text-black">
                  {chunk.title}
                </p>
                <p className="text-sm text-gray-700 mt-1">{chunk.content}</p>
              </div>
              <div className="shrink-0">
                <button
                  onClick={() => handleShowMore(chunk.id)}
                  className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-blue-500"
                >
                  Tutki
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">Ei chunkkeja</p>
      )}
    </div>
  );
}
