import { Chat } from "../types";

interface ChatListProps {
  chats: Chat[];
  activeChatId: string | null;
  onChatSelect: (chatId: string) => void;
  onNewChat: () => void;
  onDeleteChat: (chatId: string) => void;
}

function ChatList({
  chats,
  activeChatId,
  onChatSelect,
  onNewChat,
  onDeleteChat,
}: ChatListProps) {
  return (
    <div className="w-64 border-r border-gray-200 h-screen">
      <div className="p-4">
        <button
          onClick={onNewChat}
          className="w-full py-2 px-4 bg-black text-white hover:opacity-80"
        >
          New Chat
        </button>
      </div>
      <div className="overflow-y-auto">
        {chats.map((chat) => (
          <div
            key={chat.id}
            className={`p-4 cursor-pointer flex justify-between items-center hover:bg-gray-100 ${
              chat.id === activeChatId ? "bg-gray-100" : ""
            }`}
          >
            <div
              className="flex-1 truncate"
              onClick={() => onChatSelect(chat.id)}
            >
              {chat.title}
            </div>
            <button
              onClick={() => onDeleteChat(chat.id)}
              className="ml-2 text-gray-500 hover:text-black"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChatList;
