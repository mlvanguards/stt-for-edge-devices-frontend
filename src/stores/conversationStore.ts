import { create } from "zustand";
import { ConversationResponse } from "../services/api";

export interface ConversationHistory {
  user: "model" | "user";
  transcription: string;
  audio: string;
}

interface ConversationStore {
  history: ConversationHistory[];
  currentConversation: ConversationResponse | null;
  addToHistory: (history: ConversationHistory) => void;
  modifyLastHistoryEntry: (history: ConversationHistory) => void;
  setCurrentConversation: (conversation: ConversationResponse | null) => void;
}

export const useConversationStore = create<ConversationStore>((set) => ({
  history: [],
  currentConversation: null,
  addToHistory: (history) =>
    set((state) => ({ history: [...state.history, history] })),
  modifyLastHistoryEntry: (history) =>
    set((state) => ({
      history: [...state.history.slice(0, -1), history],
    })),
  setCurrentConversation: (conversation) => {
    set({ currentConversation: conversation });
    if (conversation?.conversation_id) {
      localStorage.setItem("conversation_id", conversation.conversation_id);
    }
  },
}));
