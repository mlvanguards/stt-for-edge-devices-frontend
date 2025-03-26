import { useEffect, useState } from "react";
import { useVoiceStore } from "../stores/voiceStore";
import { api } from "../services/api";

export const useVoices = () => {
  const { setVoices, setSelectedVoice } = useVoiceStore();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchVoices = async () => {
      try {
        setIsLoading(true);
        const response = await api.getAvailableVoices();
        setVoices(response.voices);

        setSelectedVoice(response.voices[0]);
      } catch (error) {
        console.error("Error fetching STT models:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchVoices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { isLoading };
};
