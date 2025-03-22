import { create } from "zustand";
import { STTModel } from "../services/api";

interface STTModelState {
  models: STTModel[];
  currentModel: STTModel | null;
  setCurrentModel: (model: STTModel | null) => void;
  setModels: (models: STTModel[]) => void;
}

export const useSTTModelStore = create<STTModelState>((set) => ({
  models: [],
  currentModel: null,
  setModels: (models: STTModel[]) => set({ models }),
  setCurrentModel: (model: STTModel | null) => {
    set({ currentModel: model });
  },
}));
