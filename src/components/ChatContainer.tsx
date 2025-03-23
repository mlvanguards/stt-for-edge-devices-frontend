import { useEffect, useRef } from "react";
import AudioMessage from "./AudioMessage";
import AudioRecorder from "./AudioRecorder";
import ChatInitializer from "./ChatInitializer";
import { useConversationStore } from "../stores/conversationStore";
import { useConversation } from "../hooks/useConversation";

const ChatContainer = () => {
  const { history, currentConversation, setCurrentConversation } =
    useConversationStore();
  const {
    isCreating,
    isSendingAudio,
    isFetching,
    createConversation,
    sendAudioMessage,
    fetchConversation,
  } = useConversation();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history, isSendingAudio]);

  const onNewRecording = async (blob: Blob) => {
    if (!currentConversation) {
      const conversation = await createConversation();
      if (conversation) setCurrentConversation(conversation);
    }
    await sendAudioMessage(
      new File([blob], "recording.webm", { type: blob.type }),
      currentConversation?.conversation_id || ""
    );
  };

  useEffect(() => {
    if (currentConversation) {
      fetchConversation(currentConversation.conversation_id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="flex-1 overflow-y-auto p-6 space-y-6 min-h-[60vh] max-h-[70vh]">
        <ChatInitializer />

        {history.map((message, index) => (
          <AudioMessage
            key={index}
            audioUrl={message.audio}
            transcript={message.transcription}
            isUser={message.user === "user"}
          />
        ))}

        {isSendingAudio && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl p-4 max-w-[70%]">
              <div className="flex space-x-2">
                <div
                  className="w-2 h-2 rounded-full bg-[#F27405] animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <div
                  className="w-2 h-2 rounded-full bg-[#F27405] animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <div
                  className="w-2 h-2 rounded-full bg-[#F27405] animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex items-center space-x-4">
        <AudioRecorder
          onRecordingComplete={onNewRecording}
          disabled={isCreating || isSendingAudio || isFetching}
        />
      </div>
    </>
  );
};

export default ChatContainer;
