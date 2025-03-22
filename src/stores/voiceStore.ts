import { create } from "zustand";

interface Voice {
  voice_id: string;
  name: string;
  preview_url: string;
  category: "premade";
}

interface VoiceStore {
  // State
  voices: Voice[];
  selectedVoiceId: string | null;

  // Actions
  setSelectedVoiceId: (id: string) => void;
  setVoices: (voices: Voice[]) => void;
}

export const useVoiceStore = create<VoiceStore>((set) => ({
  // Initial state
  voices: [],
  selectedVoiceId: null,

  // Actions
  setSelectedVoiceId: (id) => set({ selectedVoiceId: id }),
  setVoices: (voices) => set({ voices }),
}));
