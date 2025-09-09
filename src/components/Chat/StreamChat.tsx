import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef, useState } from "react";

const baseURL = import.meta.env.VITE_BASE_URL;

export default function StreamChat() {
  const [chatLogId, setChatLogId] = useState<string>("");
  const [input, setInput] = useState<string>("");
  
  const chatLogIdRef = useRef(chatLogId);

  // aina kun state päivittyy, päivitä ref
  useEffect(() => {
    chatLogIdRef.current = chatLogId;
  }, [chatLogId]);

  const { messages, sendMessage } = useChat({
    transport: new DefaultChatTransport({
      api: `${baseURL}/chat/stream`,
      headers: {
        authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4YjAwMjFhNzUwZDk4YWY1MGQ2MjU1MSIsImVtYWlsIjoiam9obmRvZUBnbWFpbC5jb20iLCJwYXNzd29yZCI6IiQyYiQxMCQ4SUZ2bzkvTlpFSURVb0pCUE5sTVVPamRZRDF3RElKN1I3SDlMcW1uSkxrWEE1dTlTd3kudSIsImlhdCI6MTc1NzMzODkxNCwiZXhwIjoxNzU3MzQyNTE0fQ.9CR2WUlqnqhPP-cAgCkU_fE8rJekxY5Ry1KjA8zraxo`,
      },
      body: () => ({
        chatLogId: chatLogIdRef.current, // aina tuore arvo
      }),
    }),
      onData: (dataPart) => {
        console.log("Received data part:", dataPart.data);
        // Type assertion to tell TypeScript what properties exist
        const data = dataPart.data as { chatLogId?: string };
        console.log("Data part chatLogId:", data?.chatLogId);
        if (data && data.chatLogId) {
          setChatLogId(data.chatLogId);
        }
},
  });

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    await sendMessage({ text: input });
    setInput("");
  };

  return (
    <div className="container mx-auto max-w-3xl p-6">
      <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
        <div className="space-y-4">
          {messages.map((m, idx) => (
            <div key={idx} className="whitespace-pre-wrap">
              <div>
                <div className="font-bold">{m.role}</div>
                {m.parts.map((part, idx) => {
                  switch (part.type) {
                    case "text":
                      return <p key={idx}>{part.text}</p>;
                  }
                })}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={(e) => handleSendMessage(e)}>
          <input
            className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-black-300 rounded shadow-xl"
            value={input}
            placeholder="Kysele jotain..."
            onChange={(e) => setInput(e.currentTarget.value)}
          />
        </form>
      </div>
    </div>
  );
}
