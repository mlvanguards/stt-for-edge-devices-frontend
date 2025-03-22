import { useSTTModels } from "./hooks/useSTTModels";
import ChatContainer from "./components/ChatContainer";

function App() {
  const {
    models,
    selectedModel,
    setSelectedModel,
    isLoading: isLoadingSTTModels,
  } = useSTTModels();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="w-full h-[800px] flex flex-col bg-black/30 backdrop-blur-2xl rounded-3xl overflow-hidden shadow-2xl border border-gray-600/30 p-8">
          <div>
            {isLoadingSTTModels ? (
              <div className="w-60 animate-pulse rounded-lg bg-gray-600/30 h-9"></div>
            ) : (
              <select
                value={selectedModel?.id || ""}
                onChange={(e) => {
                  const model = models.find((m) => m.id === e.target.value);
                  if (model) setSelectedModel(model);
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
          </div>

          <ChatContainer />
        </div>
      </div>
    </div>
  );
}

export default App;
