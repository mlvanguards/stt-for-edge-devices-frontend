import { MessageSquare } from "lucide-react";
import AudioMessage from "./AudioMessage";
import AudioRecorder from "./AudioRecorder";
import { ChatInitializer } from "./ChatInitializer";

const ChatContainer = () => {
  return (
    <>
      <div className="flex-1 overflow-y-auto p-6 space-y-6 min-h-[60vh] max-h-[70vh]">
        <ChatInitializer />
      </div>

      <div className="flex items-center space-x-4">
        <AudioRecorder onRecordingComplete={() => {}} />
      </div>
    </>
    // <>
    //   <div className="flex-1 overflow-y-auto p-6 space-y-6 min-h-[60vh] max-h-[70vh]">
    //     {messages.length === 0 && (
    //       <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
    //         <MessageSquare size={32} className="text-[#F27405]" />
    //         <p className="text-center">
    //           Start a conversation by recording your message
    //           <br />
    //           <span className="text-sm">
    //             Hold the mic button below to begin
    //           </span>
    //         </p>
    //       </div>
    //     )}
    //     {messages.map((message) => (
    //       <AudioMessage
    //         key={message.id}
    //         audioUrl={message.audioUrl}
    //         transcript={message.transcript}
    //         isUser={message.isUser}
    //       />
    //     ))}
    //     {isProcessing && (
    //       <div className="flex justify-start">
    //         <div className="bg-gray-100 rounded-2xl p-4 max-w-[70%]">
    //           <div className="flex space-x-2">
    //             <div
    //               className="w-2 h-2 rounded-full bg-[#F27405] animate-bounce"
    //               style={{ animationDelay: "0ms" }}
    //             />
    //             <div
    //               className="w-2 h-2 rounded-full bg-[#F27405] animate-bounce"
    //               style={{ animationDelay: "150ms" }}
    //             />
    //             <div
    //               className="w-2 h-2 rounded-full bg-[#F27405] animate-bounce"
    //               style={{ animationDelay: "300ms" }}
    //             />
    //           </div>
    //         </div>
    //       </div>
    //     )}
    //   </div>
    //   <div className="border-t border-gray-100 p-4 bg-white/90">
    //     <div className="flex items-center space-x-4">
    //       <AudioRecorder onRecordingComplete={onNewMessage} />
    //       <div className="text-sm text-gray-400">
    //         Hold to record, release to send
    //       </div>
    //     </div>
    //   </div>
    // </>
  );
};

export default ChatContainer;
