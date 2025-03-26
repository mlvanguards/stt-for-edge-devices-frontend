import { useSTTModels } from "./hooks/useSTTModels";
import ChatContainer from "./components/ChatContainer";
import { useSTTModelStore } from "./stores/modelStore";
import { useVoiceStore } from "./stores/voiceStore";
import { useVoices } from "./hooks/useVoices";
function App() {
  const { isLoading: isLoadingSTTModels } = useSTTModels();
  const { models, currentModel, setCurrentModel } = useSTTModelStore();
  const { isLoading: isLoadingVoices } = useVoices();
  const { voices, selectedVoice, setSelectedVoice } = useVoiceStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="w-full h-[800px] flex flex-col bg-black/30 backdrop-blur-2xl rounded-3xl overflow-hidden shadow-2xl border border-gray-600/30 p-8">
          <div className="flex gap-4 items-center justify-between">
            {isLoadingSTTModels ? (
              <div className="w-60 animate-pulse rounded-lg bg-gray-600/30 h-9"></div>
            ) : (
              <select
                value={currentModel?.id || ""}
                onChange={(e) => {
                  const model = models.find((m) => m.id === e.target.value);
                  if (model) setCurrentModel(model);
                }}
                className="w-60 p-2 bg-transparent text-gray-300"
                disabled={isLoadingSTTModels}
              >
                {models.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.name}
                  </option>
                ))}
              </select>
            )}

            {isLoadingVoices ? (
              <div className="w-60 animate-pulse rounded-lg bg-gray-600/30 h-9"></div>
            ) : (
              <select
                value={selectedVoice?.voice_id || ""}
                onChange={(e) => {
                  const voice = voices.find(
                    (v) => v.voice_id === e.target.value
                  );
                  if (voice) setSelectedVoice(voice);
                }}
                className="w-60 p-2 bg-transparent text-gray-300"
              >
                {voices.map((voice) => (
                  <option key={voice.voice_id} value={voice.voice_id}>
                    {voice.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <ChatContainer />
        </div>
      </div>
    </div>
  );
}

export default App;
