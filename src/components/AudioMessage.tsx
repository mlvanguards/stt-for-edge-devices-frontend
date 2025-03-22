import { useState, useEffect } from "react";
import { Play, Pause, Loader2 } from "lucide-react";
import { api } from "../services/api";
import { useVoiceStore } from "../stores/voiceStore";

interface AudioMessageProps {
  audioUrl: string;
  transcript: string;
  isUser: boolean;
}

const AudioMessage = ({ audioUrl, transcript, isUser }: AudioMessageProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioElement] = useState(new Audio(audioUrl));

  const { selectedVoice } = useVoiceStore();
  const [isLoadingVoice, setIsLoadingVoice] = useState(false);
  const [ttsAudio, setTtsAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (ttsAudio) {
        ttsAudio.pause();
        ttsAudio.src = "";
      }
    };
  }, [ttsAudio]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      audioElement.pause();
    } else {
      audioElement.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTextToSpeech = async () => {
    if (isPlaying && ttsAudio) {
      ttsAudio.pause();
      setIsPlaying(false);
      return;
    }

    try {
      setIsLoadingVoice(true);
      const response = await api.textToSpeech(
        transcript,
        selectedVoice?.voice_id
      );

      const binaryString = window.atob(response.audio_base64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const audioBlob = new Blob([bytes], { type: "audio/wav" });
      const audioUrl = URL.createObjectURL(audioBlob);

      const newAudio = new Audio(audioUrl);
      newAudio.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
      };

      setTtsAudio(newAudio);
      setIsPlaying(true);
      newAudio.play();
    } catch (error) {
      console.error("Error generating speech:", error);
    } finally {
      setIsLoadingVoice(false);
    }
  };

  audioElement.onloadedmetadata = () => {
    setDuration(audioElement.duration);
  };

  audioElement.ontimeupdate = () => {
    setProgress((audioElement.currentTime / audioElement.duration) * 100);
  };

  audioElement.onended = () => {
    setIsPlaying(false);
    setProgress(0);
  };

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} group`}>
      <div
        className={`max-w-[70%] rounded-2xl transition-all p-2
        ${
          isUser
            ? "bg-gradient-to-br from-[#F27405] to-[#F1B441] text-white"
            : "text-gray-100"
        }`}
      >
        <div className="flex items-center space-x-2 p-2">
          <button
            onClick={isUser ? handlePlayPause : handleTextToSpeech}
            className={`w-8 h-8 rounded-full flex items-center justify-center
              ${isUser ? "bg-white/20" : "bg-[#F27405]"}`}
          >
            {isLoadingVoice ? (
              <Loader2 size={18} className="animate-spin" />
            ) : isPlaying ? (
              <Pause
                size={18}
                className={isUser ? "text-white" : "text-white"}
              />
            ) : (
              <Play
                size={18}
                className={isUser ? "text-white" : "text-white"}
              />
            )}
          </button>

          <div className="flex-1">
            <div className="w-full bg-gray-200/30 rounded-full h-1">
              <div
                className={`h-full rounded-full ${isUser ? "bg-white" : "bg-[#F27405]"}`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <span className="text-sm min-w-[40px]">
            {formatTime(isPlaying ? audioElement.currentTime : duration)}
          </span>
        </div>

        <p
          className={`text-sm px-2 pb-1 ${isUser ? "text-white/90" : "text-gray-100"}`}
        >
          {transcript}
        </p>
      </div>
    </div>
  );
};

export default AudioMessage;
