import { useState, useRef } from "react";
import { Mic, Trash2, Play } from "lucide-react";

interface AudioRecorderProps {
  onRecordingComplete: (blob: Blob) => void;
  disabled: boolean;
}

const AudioRecorder = ({
  onRecordingComplete,
  disabled,
}: AudioRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<number | null>(null);
  const startYRef = useRef<number>(0);
  const chunksRef = useRef<Blob[]>([]);
  const isMobile = window.matchMedia("(pointer: coarse)").matches;

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsDragging(false);
    }
  };

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
          const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
          onRecordingComplete(audioBlob);
        }
        chunksRef.current = [];
        setRecordingDuration(0);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);

      timerRef.current = window.setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  };

  // Handle mouse events
  const handleMouseDown = () => {
    if (!isMobile) startRecording();
  };

  const handleMouseUp = () => {
    if (!isMobile) stopRecording();
  };

  // Handle touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isMobile) {
      startYRef.current = e.touches[0].clientY;
      startRecording();
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isMobile && isRecording) {
      const currentY = e.touches[0].clientY;
      const diff = startYRef.current - currentY;

      if (diff > 50) {
        setIsDragging(true);
      } else {
        setIsDragging(false);
      }
    }
  };

  const handleTouchEnd = () => {
    if (isMobile) stopRecording();
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="relative mx-auto">
      <div className="flex flex-col items-center relative">
        {/* Record button */}
        <button
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className={`min-w-14 h-14 md:min-w-16 md:h-16 rounded-full flex items-center justify-center transition-all duration-200
          hover:opacity-90 active:scale-95
          ${isRecording ? "bg-red-500 scale-110" : "bg-[#F27405]"}`}
          disabled={disabled}
        >
          {isRecording ? (
            <Mic className="text-white" size={isMobile ? 24 : 28} />
          ) : (
            <Play className="text-white" size={isMobile ? 24 : 28} />
          )}
        </button>

        {/* Recording status indicator */}
        <div className="absolute -top-[60px] md:top-[5px] md:left-[130px] min-h-[40px] flex justify-center items-center">
          {isRecording && (
            <div
              className={`px-6 w-max py-3 rounded-full transition-all duration-200 ${
                isDragging ? "bg-red-500" : "bg-gray-800 md:bg-transparent"
              } text-white text-sm md:text-base flex items-center gap-3 shadow-lg`}
            >
              {isDragging ? (
                <>
                  <Trash2 className="text-white" size={isMobile ? 18 : 20} />
                  <span>Release to cancel</span>
                </>
              ) : (
                <>
                  <span className="animate-pulse text-red-500">●</span>
                  <span>{formatDuration(recordingDuration)}</span>
                  <span className="text-gray-300">
                    {isMobile ? "Slide up to cancel" : "Release to stop"}
                  </span>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Instructions text */}
      <p className="mt-4 text-sm md:text-base text-gray-400 text-center w-full  ">
        {isMobile ? "Hold and slide up to cancel" : "Click and hold to record"}
      </p>
    </div>
  );
};

export default AudioRecorder;
