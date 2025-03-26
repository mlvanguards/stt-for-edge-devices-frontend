import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useConversationStore } from "../stores/conversationStore";
import { useVoiceStore } from "../stores/voiceStore";

const ChatInitializer = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasExistingChat, setHasExistingChat] = useState(false);
  const { setCurrentConversation } = useConversationStore();
  const { selectedVoice } = useVoiceStore();

  useEffect(() => {
    const initializeChat = async () => {
      const conversationId = localStorage.getItem("conversation_id");

      if (conversationId) {
        try {
          const history = await api.getConversation(conversationId);
          setHasExistingChat(true);

          setCurrentConversation(history);
        } catch (error) {
          console.error("Failed to fetch chat history:", error);
        }
      }

      setIsLoading(false);
    };

    initializeChat();
  }, [setCurrentConversation]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!hasExistingChat) {
    return (
      <div className="flex flex-col gap-4 items-center justify-center h-full">
        <h1 className="text-5xl text-white font-bold">
          👋 Welcome little one!
        </h1>
        <p className="text-2xl text-gray-400">
          Start chatting with 🤖{" "}
          {selectedVoice?.name ?? (
            <div className="w-20 animate-pulse rounded-lg bg-gray-600/30 h-9" />
          )}{" "}
          the AI.
        </p>
      </div>
    );
  }

  return null;
};

export default ChatInitializer;
