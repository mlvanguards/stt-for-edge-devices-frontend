import { useState, useCallback } from "react";
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

  const createConversation = useCallback(
    async (systemPrompt?: string) => {
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
    },
    [selectedVoice?.voice_id, currentModel?.id, setCurrentConversation]
  );

  const sendAudioMessage = useCallback(
    async (file: File, conversationId: string, voiceId?: string) => {
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
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return {
    isCreating,
    isSendingAudio,
    createConversation,
    sendAudioMessage,
  };
};
