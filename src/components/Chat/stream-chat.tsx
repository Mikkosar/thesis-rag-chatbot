import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef, useState } from "react";
import ChatBoXTopBar from "./chat-components/chat-box-top-bar";
import ChatBoxMessages from "./chat-components/chat-box-messages";
import ChatBoxInputForm from "./chat-components/chat-box-input-form";
const baseURL = import.meta.env.VITE_BASE_URL;

export default function StreamChat() {
  const [chatLogId, setChatLogId] = useState<string>("");
  const [input, setInput] = useState<string>("");

  const chatLogIdRef = useRef(chatLogId);

  // aina kun state päivittyy, päivitä ref
  useEffect(() => {
    chatLogIdRef.current = chatLogId;
  }, [chatLogId]);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: `${baseURL}/chat/stream`,
      headers: {
        //authorization: `Bearer ...`,
      },
      body: () => ({
        chatLogId: chatLogIdRef.current, // aina tuore arvo
      }),
    }),
    onData: (dataPart) => {
      console.log("Received data part:", dataPart.data);
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
    <div className="flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-[600px] h-[900px] flex flex-col overflow-hidden">
        <ChatBoXTopBar />
        <ChatBoxMessages messages={messages} status={status} />
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
