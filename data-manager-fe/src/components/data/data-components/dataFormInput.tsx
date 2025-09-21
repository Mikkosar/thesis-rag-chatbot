// src/components/data/data-components/dataFormInput.tsx
// Uudelleenkäytettävä textarea-kenttä lomakkeille

import type { Chunk } from "../../../types/chunk";

type DataFormInputProps = {
  formData: Partial<Chunk>; // Lomakkeen tila (ei käytetä tässä komponentissa)
  handleChange: ( // Muutoksen käsittelijä
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  placeholder?: string; // Placeholder-teksti
  name?: string; // Kentän nimi
  text?: string; // Ohjeteksti
  label: string; // Kentän otsikko
  rows?: number; // Rivien määrä
  value?: string; // Kentän arvo
};

const DataFormInput = ({
  handleChange,
  placeholder,
  name,
  text,
  label,
  rows,
  value
}: DataFormInputProps) => {
  return (
    <div className="sm:col-span-6">
      {/* Kentän otsikko */}
      <label htmlFor="content" className="block text-md font-medium text-black">
        {label}
      </label>
      {/* Ohjeteksti */}
      <p className="font-light text-base">{text}</p>
      <div className="mt-2">
        {/* Textarea-kenttä */}
        <textarea
          name={name}
          value={value || ""}
          onChange={handleChange}
          placeholder={placeholder}
          rows={rows}
          className="block w-full rounded-md border border-gray-500 bg-white py-1.5 px-3 text-base text-black placeholder:text-gray-500 focus:border-gray-500 focus:ring-2 focus:ring-gray-500 sm:text-sm"
        />
      </div>
    </div>
  );
};

export default DataFormInput;
