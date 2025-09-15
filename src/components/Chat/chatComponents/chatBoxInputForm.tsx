type ChatBoxInputFormProps = {
  handleSendMessage: (e: React.FormEvent) => void;
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
};

const ChatBoxInputForm = ({
  handleSendMessage,
  input,
  setInput,
}: ChatBoxInputFormProps) => {
  return (
    <div className="p-4 bg-gray-50 border-t">
      <form onSubmit={handleSendMessage} className="flex space-x-2">
        <input
          className="flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={input}
          placeholder="Kysele jotain..."
          onChange={(e) => setInput(e.currentTarget.value)}
        />
        <button
          type="submit"
          className="px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          disabled={!input.trim()}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default ChatBoxInputForm;
