import type { UIDataTypes, UIMessage, UITools } from "ai";

type Props = {
  messages: UIMessage<unknown, UIDataTypes, UITools>[];
  status: string;
};

const ChatBoxMessages = ({ messages, status }: Props) => {
  return (
    <div className="flex-1 p-4 overflow-y-auto flex flex-col">
      {messages.length > 0 ? (
        <div className="space-y-4 flex-1">
          {messages.map((message, idx) => (
            <div
              key={idx}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-2xl ${
                  message.role === "user"
                    ? "bg-blue-500 text-white rounded-br-md"
                    : "bg-gray-200 text-gray-800 rounded-bl-md"
                }`}
              >
                <div className="whitespace-pre-wrap break-words">
                  {message.role === "assistant" && 
                   idx === messages.length - 1 && 
                   (!message.parts || message.parts.length === 0 || 
                    !message.parts.some(part => part.type === "text" && part.text && part.text.trim())) ? (
                    // Näytä lataussymboli tyhjässä assistant-viestissä
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  ) : (
                    // Näytä normaali viesti tai streaming-teksti
                    message.parts.map((part, idx) => {
                      switch (part.type) {
                        case "text":
                          return <p key={idx}>{part.text}</p>;
                      }
                    })
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Keskitetty viesti kun ei ole keskusteluja
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-gray-500 px-6">
            <div className="mb-4">
              <svg
                className="w-12 h-12 mx-auto text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <p className="text-sm">
              Täällä voit testata StreamChat ominaisuutta. Palvelimelta tulee
              tekoälyn vastaus streaminä
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBoxMessages;
