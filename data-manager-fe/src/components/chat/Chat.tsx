// src/components/chat/Chat.tsx
// Yksinkertainen chat-komponentti, joka käyttää bulk-vastausta (ei streamiä)

import { useState } from "react";
import type { MessageList, Message } from "../../types/chat";
import chatApi from "../../services/chat";

// Tämä on esimerkki Chat-komponentista, joka käyttää bulkkivastausta
// eikä streamiä. Tämä on yksinkertaisempi toteutus ilman reaaliaikaista päivitystä.

export default function Chat() {
  // Syötekentän arvo
  const [input, setInput] = useState("");
  // Chat-viestien lista
  const [messages, setMessages] = useState<MessageList>([]);

  // Käsittelee viestin lähettämisen
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Luodaan käyttäjän viesti
    const message: Message = {
      id: undefined,
      role: "user",
      content: input,
    };

    // Lisätään viesti listaan ja tyhjennetään syöte
    const newMessages = [...messages, message];
    setMessages(newMessages);
    setInput("");

    try {
      // Lähetetään viesti palvelimelle ja odotetaan vastausta
      const response: Message = await chatApi.sendMessage(newMessages);
      console.log("Received response:", response);

      // Lisätään vastaus viestilistaan
      setMessages([...newMessages, response]);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="flex items-center justify-center p-4">
      {/* Kännykän muotoinen container */}
      <div className="bg-white rounded-3xl shadow-2xl w-[600px] h-[900px] flex flex-col overflow-hidden">
        {/* Chat-otsikko */}
        <div className="bg-gray-500 text-white p-4 text-center font-semibold">
          Chat AI
        </div>

        {/* Viestilista */}
        <div className="flex-1 p-4 overflow-y-auto flex flex-col">
          {messages.length > 0 ? (
            <div className="space-y-4 flex-1">
              {/* Renderöidään jokainen viesti */}
              {messages.map((message, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {/* Viestin kupla */}
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      message.role === "user"
                        ? "bg-blue-500 text-white rounded-br-md"
                        : "bg-gray-200 text-gray-800 rounded-bl-md"
                    }`}
                  >
                    <div className="whitespace-pre-wrap break-words">
                      {message.content}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Tyhjä tila kun ei ole viestejä
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-gray-500 px-6">
                <div className="mb-4">
                  {/* Chat-ikoni */}
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
                  Täällä voit testata Chat ominaisuutta. Palvelimelta tulee
                  tekoälyn vastaus bulkkina
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Syöte-lomake */}
        <div className="p-4 bg-gray-50 border-t">
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            {/* Syötekenttä */}
            <input
              className="flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={input}
              placeholder="Kysele jotain..."
              onChange={(e) => setInput(e.currentTarget.value)}
            />
            {/* Lähetys-painike */}
            <button
              type="submit"
              className="px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              disabled={!input.trim()}
            >
              {/* Lähetys-ikoni */}
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
      </div>
    </div>
  );
}
