import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export interface ConversationCreate {
  system_prompt?: string;
  voice_id?: string | null;
  stt_model_id?: string | null;
}

export interface ConversationResponse {
  conversation_id: string;
  system_prompt: string;
  voice_id: string;
  messages: string[];
}

export interface ChatResponse {
  conversation_id: string;
  transcription: string;
  response: string;
  model: string;
  tts_audio_base64: string | null;
}

export interface STTModel {
  id: string;
  name: string;
  description: string;
}

export const api = {
  // Conversation endpoints
  async createConversation(data: ConversationCreate) {
    const response = await axios.post<ConversationResponse>(
      `${BASE_URL}/create_conversation`,
      data
    );
    return response.data;
  },

  async getConversation(conversationId: string) {
    const response = await axios.get<ConversationResponse>(
      `${BASE_URL}/conversations/${conversationId}`
    );
    return response.data;
  },

  async deleteConversation(conversationId: string) {
    await axios.delete(`${BASE_URL}/conversations/${conversationId}`);
  },

  async listConversations(limit = 10, skip = 0) {
    const response = await axios.get(`${BASE_URL}/conversations`, {
      params: { limit, skip },
    });
    return response.data;
  },

  // Chat endpoint
  async processAudio(file: File, requestData: string, forceSplit = false) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("request_data", requestData);
    formData.append("force_split", String(forceSplit));

    const response = await axios.post<ChatResponse>(
      `${BASE_URL}/chat`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  async getSTTModels() {
    const response = await axios.get<{
      models: STTModel[];
      default_model: string;
    }>(`${BASE_URL}/available_models`);
    return response.data;
  },

  // TTS endpoints
  async textToSpeech(text: string, voiceId?: string) {
    const response = await axios.post(`${BASE_URL}/tts_only`, {
      text,
      voice_id: voiceId,
    });
    return response.data;
  },

  async getAvailableVoices() {
    const response = await axios.get(`${BASE_URL}/available_voices`);
    return response.data;
  },
};
