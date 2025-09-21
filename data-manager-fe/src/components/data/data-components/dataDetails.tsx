// src/components/data/data-components/dataDetails.tsx
// Komponentti chunkin tietojen näyttämiseen (vain lukutilassa)

type DataDetailsProps = {
    content: string; // Chunkin sisältö
    timestamp: string; // Luomisaika
};

const DataDetails = ({ content, timestamp }: DataDetailsProps) => {
    return (
        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
              {/* Sisältö-kenttä */}
              <div className="sm:col-span-1">
                <label
                  htmlFor="content"
                  className="block text-sm font-medium text-black"
                >
                  Content:
                </label>
              </div>
              <div className="sm:col-span-5">
                <p className="mt-1 text-sm text-black">{content}</p>
              </div>

              {/* Luomisaika-kenttä */}
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
                  {/* Muunnetaan timestamp suomalaisessa muodossa */}
                  {new Date(timestamp).toLocaleString("fi-FI")}
                </p>
              </div>
            </div>

    )
}

export default DataDetails;