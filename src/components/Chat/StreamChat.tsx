import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState } from "react";

const baseURL = import.meta.env.VITE_BASE_URL;

export default function StreamChat() {
  const [input, setInput] = useState("");
  const { messages, sendMessage } = useChat({
    transport: new DefaultChatTransport({
      api: `${baseURL}/chat/stream`,
      headers: {
        //authorization: `Bearer Aseta token tähän`,
      },
      body: {
        //chatLogId: "ChatLogId tähän",
      },
    }),
    onData: (dataPart) => {
      console.log("Received data part:", dataPart.data);
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
