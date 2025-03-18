import { useState, useEffect } from "react";
import ChatContainer from "./components/ChatContainer";
import { Message } from "./types";

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const mockBotResponse = async () => {
    setIsProcessing(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Mock bot response
    const responses = [
      "Hello! How can I assist you today?",
      "That's interesting! Tell me more about it.",
      "I understand. Let me help you with that.",
      "Is there anything else you'd like to discuss?",
    ];

    const randomResponse =
      responses[Math.floor(Math.random() * responses.length)];

    // Using a static audio file for demo - you would generate this from TTS
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        audioUrl: "/mock-bot-response.mp3", // You'll need to add an audio file to public folder
        transcript: randomResponse,
        isUser: false,
      },
    ]);

    setIsProcessing(false);
  };

  const handleNewMessage = async (audioBlob: Blob, transcript: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        audioUrl: URL.createObjectURL(audioBlob),
        transcript,
        isUser: true,
      },
    ]);

    // Trigger bot response
    await mockBotResponse();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-light text-center mb-8 text-gray-800">
          Voice<span className="text-[#F27405] font-medium">AI</span> Chat
        </h1>
        <ChatContainer
          messages={messages}
          onNewMessage={handleNewMessage}
          isProcessing={isProcessing}
        />
      </div>
    </div>
  );
}

export default App;
