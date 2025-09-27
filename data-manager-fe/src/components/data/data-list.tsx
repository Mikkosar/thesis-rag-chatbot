// src/components/data/data-list.tsx
// Pääsivu, joka näyttää listan chunk-otsikoista ja mahdollistaa uuden chunkin luomisen

import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../hook";
import Button from "../button";

export default function DataList() {
  // Haetaan chunkit Redux storesta
  const chunks = useAppSelector((state) => state.chunks ?? []);
  // Luodaan uniikit otsikot chunk-listaan (poistetaan duplikaatit)
  const uniqueTitles = Array.from(new Set(chunks.map((chunk) => chunk.title)));

  const navigate = useNavigate();

  // Siirtyy chunkin tietosivulle otsikon perusteella
  const handleShowMore = (title: string) => {
    navigate(`/data/${title}`);
  };

  // Siirtyy uuden chunkin luontisivulle
  const handleCreate = () => {
    navigate(`/create`);
  };

  return (
    <div className="container mx-auto w-full max-w-screen-lg px-4 sm:px-6 lg:px-8 py-6 flex flex-col">
      {/* Sivun otsikko */}
      <h1 className="font-bold text-black justify-item justify-center flex text-xl mb-4">
        Chunkit tietokannassa
      </h1>
      
      {/* Uuden chunkin luontipainike */}
      <div className="flex justify-center mb-4">
        <Button text="Luo uusi chunk +" onClick={() => handleCreate()} type="button" color="green" />
      </div>

      {/* Chunk-lista tai tyhjä viesti */}
      {chunks && uniqueTitles ? (
        <ul
          role="list"
          className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
        >
          {/* Renderöidään jokainen uniikki otsikko */}
          {uniqueTitles.map((title: string, idx) => (
            <li
              key={idx}
              className="flex items-center justify-between gap-x-6 p-4 rounded-xl shadow-lg"
            >
              {/* Otsikko */}
              <div className="min-w-0 flex-auto flex flex-col">
                <p className="text-sm font-semibold text-black">{title}</p>
              </div>
              {/* "Näytä lisää" -painike */}
              <div className="shrink-0">
                <Button text="Näytä Lisää" onClick={() => handleShowMore(title)} type="submit" color="gray" />
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
