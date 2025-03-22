import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useVoiceStore } from "../stores/voiceStore";

export const useBotVoice = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { voices, selectedVoiceId, setSelectedVoiceId, setVoices } =
    useVoiceStore();

  useEffect(() => {
    fetchVoices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchVoices = async () => {
    setIsLoading(true);
    try {
      const response = await api.getAvailableVoices();
      setVoices(response.voices);
    } catch (error) {
      console.error("Error fetching voices:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    voices,
    voiceId: selectedVoiceId,
    setVoiceId: setSelectedVoiceId,
    isLoading,
  };
};
