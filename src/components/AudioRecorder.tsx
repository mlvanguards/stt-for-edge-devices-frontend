import { useState, useRef } from "react";
import { Mic, MicOff, Trash2, Circle } from "lucide-react";

interface AudioRecorderProps {
  onRecordingComplete: (blob: Blob, transcript: string) => void;
}

const AudioRecorder = ({ onRecordingComplete }: AudioRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startYRef = useRef<number>(0);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        if (!isDragging) {
          // Only complete if not dragged to cancel
          const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
          onRecordingComplete(audioBlob, "Voice message");
        }
        chunksRef.current = [];
        setRecordingDuration(0);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);

      // Start duration timer
      timerRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    startYRef.current = e.touches[0].clientY;
    startRecording();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isRecording) {
      const currentY = e.touches[0].clientY;
      const diff = startYRef.current - currentY;

      if (diff > 50) {
        // Threshold to show cancel state
        setIsDragging(true);
      } else {
        setIsDragging(false);
      }
    }
  };

  const handleTouchEnd = () => {
    if (mediaRecorderRef.current && isRecording) {
      clearInterval(timerRef.current);
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsDragging(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="relative">
      {isRecording && (
        <div className="absolute left-0 right-0 bottom-full mb-4 flex justify-center">
          <div
            className={`px-4 py-2 rounded-full ${
              isDragging ? "bg-red-500" : "bg-gray-800"
            } text-white text-sm flex items-center space-x-2`}
          >
            {isDragging ? (
              <>
                <Trash2 className="text-white" size={18} />
                <span>Release to cancel</span>
              </>
            ) : (
              <>
                <span className="animate-pulse">●</span>
                <span>{formatDuration(recordingDuration)}</span>
                <span className="text-gray-300">Slide up to cancel</span>
              </>
            )}
          </div>
        </div>
      )}

      <button
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all
          ${isRecording ? "bg-red-500 scale-125" : "bg-[#F27405]"}`}
      >
        {isRecording ? (
          <Mic className="text-white" size={24} />
        ) : (
          <MicOff className="text-white" size={24} />
        )}
      </button>
    </div>
  );
};

export default AudioRecorder;
