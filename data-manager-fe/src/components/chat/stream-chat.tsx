// src/components/chat/stream-chat.tsx
// Chat-komponentti, joka käyttää AI SDK:ta reaaliaikaisen streamin kanssa

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef, useState } from "react";
import ChatBoXTopBar from "./chat-components/chat-box-top-bar";
import ChatBoxMessages from "./chat-components/chat-box-messages";
import ChatBoxInputForm from "./chat-components/chat-box-input-form";

// Palvelimen perus-URL ympäristömuuttujasta
const baseURL = import.meta.env.VITE_BASE_URL;

export default function StreamChat() {
  // Chat-session tunniste
  const [chatLogId, setChatLogId] = useState<string>("");
  // Syötekentän arvo
  const [input, setInput] = useState<string>("");

  // Ref chatLogId:lle, jotta se pysyy ajan tasalla useChat-hookin sisällä
  const chatLogIdRef = useRef(chatLogId);

  // Päivittää ref:n aina kun state muuttuu
  useEffect(() => {
    chatLogIdRef.current = chatLogId;
  }, [chatLogId]);

  // AI SDK:n chat-hook stream-ominaisuuksilla
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: `${baseURL}/chat/stream`, // Stream-endpoint
      headers: {
        // authorization: `Bearer ...`, // Autentikointi (ei käytössä)
      },
      body: () => ({
        chatLogId: chatLogIdRef.current, // Lähetetään aina tuore chatLogId
      }),
    }),
    // Käsittelee streamin data-osia
    onData: (dataPart) => {
      console.log("Received data part:", dataPart.data);
      const data = dataPart.data as { chatLogId?: string };
      console.log("Data part chatLogId:", data?.chatLogId);
      // Päivitetään chatLogId jos se tulee vastauksessa
      if (data && data.chatLogId) {
        setChatLogId(data.chatLogId);
      }
    },
  });

  // Käsittelee viestin lähettämisen
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return; // Ei lähetetä tyhjää viestiä
    await sendMessage({ text: input });
    setInput(""); // Tyhjennetään syötekenttä
  };

  return (
    <div className="flex items-center justify-center px-4 sm:px-6 lg:px-8 py-4">
      {/* Kännykän muotoinen chat-container */}
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-[600px] h-[80vh] md:h-[85vh] lg:h-[900px] flex flex-col overflow-hidden">
        {/* Chat-otsikko */}
        <ChatBoXTopBar />
        {/* Viestilista */}
        <ChatBoxMessages messages={messages} status={status} />
        {/* Syöte-lomake */}
        <ChatBoxInputForm
          handleSendMessage={handleSendMessage}
          input={input}
          setInput={setInput}
          status={status}
        />
      </div>
    </div>
  );
}
