type DataDetailsProps = {
    content: string;
    timestamp: string;
};

const DataDetails = ({ content, timestamp }: DataDetailsProps) => {
    return (
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
                <p className="mt-1 text-sm text-black">{content}</p>
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
                  {new Date(timestamp).toLocaleString("fi-FI")}
                </p>
              </div>
            </div>

    )
}

export default DataDetails;