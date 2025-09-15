import type { Chunk } from "../../../types/chunk";

type DataFormInputProps = {
  formData: Partial<Chunk>;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  placeholder?: string;
  name?: string;
  text?: string;
  label: string;
  rows?: number;
};

const DataFormInput = ({
  formData,
  handleChange,
  placeholder,
  name,
  text,
  label,
  rows,
}: DataFormInputProps) => {
  return (
    <div className="sm:col-span-6">
      <label htmlFor="content" className="block text-md font-medium text-black">
        {label}
      </label>
      <p className="font-light text-base">{text}</p>
      <div className="mt-2">
        <textarea
          name={name}
          value={formData.content || ""}
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
