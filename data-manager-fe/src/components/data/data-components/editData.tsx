// src/components/data/data-components/editData.tsx
// Muokkaus-kentät chunkin tietojen muokkaamiseen

type EditDataProps = {
    title: string; // Chunkin otsikko
    content: string; // Chunkin sisältö
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void; // Muutoksen käsittelijä
}

const EditData = ({ title, content, onChange }: EditDataProps) => {
    return (
        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  {/* Otsikko-kenttä */}
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
                        value={title || ""}
                        placeholder="Esim. Erityisopetus"
                        onChange={onChange}
                        className="block w-full rounded-md border border-gray-500 bg-white py-1.5 px-3 text-base text-black placeholder:text-gray-500 focus:border-gray-500 focus:ring-2 focus:ring-gray-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  
                  {/* Sisältö-kenttä */}
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
                        value={content || ""}
                        onChange={onChange}
                        rows={10}
                        className="block w-full rounded-md border border-gray-500 bg-white py-1.5 px-3 text-base text-black placeholder:text-gray-500 focus:border-gray-500 focus:ring-2 focus:ring-gray-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
    );
}

export default EditData;