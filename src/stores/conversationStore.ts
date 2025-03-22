import { create } from "zustand";
import { ConversationResponse } from "../services/api";

interface ConversationStore {
  // State
  currentConversation: ConversationResponse | null;
  conversationHistory: ConversationResponse[];

  // Actions

  setCurrentConversation: (conversation: ConversationResponse | null) => void;
  clearCurrentConversation: () => void;
}

export const useConversationStore = create<ConversationStore>((set) => ({
  // Initial state
  currentConversation: null,
  conversationHistory: [],

  // Actions
  setCurrentConversation: (conversation) => {
    set({ currentConversation: conversation });
    if (conversation?.conversation_id) {
      localStorage.setItem("conversation_id", conversation.conversation_id);
    }
  },
  clearCurrentConversation: () => {
    set({ currentConversation: null });
    localStorage.removeItem("conversation_id");
  },
}));
