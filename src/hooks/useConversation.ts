import { useState } from "react";
import { useConversationStore } from "../stores/conversationStore";
import { useVoiceStore } from "../stores/voiceStore";
import { useSTTModelStore } from "../stores/modelStore";
import { api } from "../services/api";

export const useConversation = () => {
  const { selectedVoice } = useVoiceStore();
  const { currentModel } = useSTTModelStore();
  const { setCurrentConversation, addToHistory, modifyLastHistoryEntry } =
    useConversationStore();

  const [isCreating, setIsCreating] = useState(false);
  const [isSendingAudio, setIsSendingAudio] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const createConversation = async (systemPrompt?: string) => {
    try {
      setIsCreating(true);

      const conversation = await api.createConversation({
        system_prompt: systemPrompt,
        voice_id: selectedVoice?.voice_id,
        stt_model_id: currentModel?.id,
      });
      setCurrentConversation(conversation);
      return conversation;
    } catch (err) {
      console.error("Error creating conversation:", err);
    } finally {
      setIsCreating(false);
    }
  };

  const sendAudioMessage = async (
    file: File,
    conversationId: string,
    voiceId?: string
  ) => {
    try {
      addToHistory({
        user: "user",
        transcription: "",
        audio: URL.createObjectURL(new Blob([file], { type: file.type })),
      });

      setIsSendingAudio(true);
      const requestData = JSON.stringify({
        conversation_id: conversationId,
        voice_id: voiceId,
      });

      const response = await api.processAudio(file, requestData);

      modifyLastHistoryEntry({
        user: "user",
        transcription: response.transcription,
        audio: URL.createObjectURL(new Blob([file], { type: file.type })),
      });

      addToHistory({
        user: "model",
        transcription: response.response,
        audio: response.tts_audio_base64 || "",
      });

      return response;
    } catch (err) {
      console.error("Error processing audio:", err);
      throw err;
    } finally {
      setIsSendingAudio(false);
    }
  };

  const fetchConversation = async (conversationId: string) => {
    try {
      setIsFetching(true);
      const conversation = await api.getConversation(conversationId);
      setCurrentConversation(conversation);
    } catch (err) {
      console.error("Error fetching conversation:", err);
    } finally {
      setIsFetching(false);
    }
  };

  const deleteStoredConversation = async (conversationId: string) => {
    try {
      await api.deleteConversation(conversationId);
    } catch (err) {
      console.error("Error deleting conversation:", err);
    }
  };

  return {
    isCreating,
    isSendingAudio,
    isFetching,
    createConversation,
    sendAudioMessage,
    fetchConversation,
    deleteStoredConversation,
  };
};
