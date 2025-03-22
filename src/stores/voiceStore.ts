import { create } from "zustand";

interface Voice {
  voice_id: string;
  name: string;
  preview_url: string;
  category: "premade";
}

interface VoiceStore {
  voices: Voice[];
  selectedVoice: Voice | null;
  setSelectedVoice: (voice: Voice) => void;
  setVoices: (voices: Voice[]) => void;
}

export const useVoiceStore = create<VoiceStore>((set) => ({
  voices: [],
  selectedVoice: null,
  setSelectedVoice: (voice) => set({ selectedVoice: voice }),
  setVoices: (voices) => set({ voices }),
}));
