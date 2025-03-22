import { useState, useEffect } from "react";
import { STTModel, api } from "../services/api";

export const useSTTModels = () => {
  const [models, setModels] = useState<STTModel[]>([]);
  const [selectedModel, setSelectedModel] = useState<STTModel | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        setIsLoading(true);
        const response = await api.getSTTModels();
        setModels(response.models);

        const defaultModel = response.models.find(
          (model) => model.id === response.default_model
        );
        setSelectedModel(defaultModel || null);
      } catch (error) {
        console.error("Error fetching STT models:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchModels();
  }, []);

  return { models, selectedModel, setSelectedModel, isLoading };
};
