import { useState } from "react";
import type { MessageList, Message } from "../../types/chat";
import chatApi from "../../services/chat";

export default function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<MessageList>([]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const message: Message = {
      id: undefined,
      role: "user",
      content: input,
    };

    const newMessages = [...messages, message];
    setMessages(newMessages);
    setInput("");

    try {
      const response: Message = await chatApi.sendMessage(newMessages);
      console.log("Received response:", response);

      setMessages([...newMessages, response]);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="container mx-auto max-w-3xl p-6">
      <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
        <div className="space-y-4">
          {messages.map((message, idx) => (
            <div key={idx} className="whitespace-pre-wrap">
              <div>
                <div className="font-bold">{message.role}</div>
                <div>{message.content}</div>
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
