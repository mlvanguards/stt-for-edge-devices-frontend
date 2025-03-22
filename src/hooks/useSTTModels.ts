import { useState, useEffect } from "react";
import { api } from "../services/api";
import { useSTTModelStore } from "../stores/modelStore";

export const useSTTModels = () => {
  const { setCurrentModel, setModels } = useSTTModelStore();
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
        setCurrentModel(defaultModel || null);
      } catch (error) {
        console.error("Error fetching STT models:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchModels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { isLoading };
};
