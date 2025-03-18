import { useState } from "react";
import { Chat } from "../types";

interface ChatWindowProps {
  chat: Chat;
  onSendMessage: (chatId: string, text: string) => void;
}

function ChatWindow({ chat, onSendMessage }: ChatWindowProps) {
  const [inputText, setInputText] = useState("");

  const handleSend = () => {
    if (inputText.trim()) {
      onSendMessage(chat.id, inputText);
      setInputText("");
    }
  };

  return (
    <div className="flex-1 flex flex-col h-screen">
      <div className="border-b border-gray-200 p-4">
        <h2 className="font-semibold">{chat.title}</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {chat.messages.map((message) => (
          <div
            key={message.id}
            className={`max-w-[70%] p-3 mb-2 ${
              message.isBot
                ? "bg-gray-100 text-black mr-auto"
                : "bg-black text-white ml-auto"
            }`}
          >
            {message.text}
          </div>
        ))}
      </div>

      <div className="flex p-5 border-t border-gray-200">
        <input
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type a message..."
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 p-2.5 border border-gray-200 mr-2.5 outline-none focus:border-black"
        />
        <button
          onClick={handleSend}
          className="px-5 py-2.5 bg-black text-white hover:opacity-80"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatWindow;
