import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../hook";

export default function DataList() {
  const chunks = useAppSelector((state) => state.chunks ?? []);
  const uniqueTitles = Array.from(new Set(chunks.map((chunk) => chunk.title)));

  const navigate = useNavigate();

  const handleShowMore = (title: string) => {
    navigate(`/data/${title}`);
  };

  const handleCreate = () => {
    navigate(`/create`);
  };

  return (
    <div className="container mx-auto max-w-3xl p-6 flex flex-col">
      <h1 className="font-bold text-black justify-item justify-center flex text-xl mb-4">
        Chunkit tietokannassa
      </h1>
      <div className="flex justify-center mb-4">
        <button
          onClick={() => handleCreate()}
          className="rounded-md bg-black-600 px-3 py-1.5 text-sm font-medium text-black shadow-sm hover:bg-green-200 transition"
        >
          Luo uusi chunk +
        </button>
      </div>

      {chunks && uniqueTitles ? (
        <ul
          role="list"
          className="grid grid-cols-1 gap-2 divide-y-1 divide-gray-500"
        >
          {uniqueTitles.map((title: string, idx) => (
            <li
              key={idx}
              className="flex items-center justify-between gap-x-6 py-5 "
            >
              <div className="min-w-0 flex-auto flex flex-col">
                <p className="text-sm font-semibold text-black">{title}</p>
              </div>
              <div className="shrink-0">
                <button
                  onClick={() => handleShowMore(title)}
                  className="rounded-md bg-black-600 px-3 py-1.5 text-sm font-medium text-black shadow-sm hover:bg-gray-300 transition"
                >
                  Lisää
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-black-500">Ei chunkkeja</p>
      )}
    </div>
  );
}
