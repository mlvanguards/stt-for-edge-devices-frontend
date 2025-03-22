import { useState, useCallback } from "react";
import { useConversationStore } from "../stores/conversationStore";
import { api } from "../services/api";

export const useConversation = () => {
  const { currentConversation, setCurrentConversation } =
    useConversationStore();

  const [isLoading, setIsLoading] = useState(false);

  const createConversation = useCallback(
    async (systemPrompt?: string, voiceId?: string) => {
      try {
        setIsLoading(true);

        const conversation = await api.createConversation({
          system_prompt: systemPrompt,
          voice_id: voiceId,
        });
        setCurrentConversation(conversation);
        return conversation;
      } catch (err) {
        console.error("Error creating conversation:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [setCurrentConversation]
  );

  const sendAudioMessage = useCallback(
    async (file: File, conversationId: string, voiceId?: string) => {
      try {
        setIsLoading(true);
        const requestData = JSON.stringify({
          conversation_id: conversationId,
          voice_id: voiceId,
        });

        const response = await api.processAudio(file, requestData);
        return response;
      } catch (err) {
        console.error("Error processing audio:", err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    isLoading,
    currentConversation,
    createConversation,
    sendAudioMessage,
  };
};
