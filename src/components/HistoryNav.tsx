import { useEffect, useState } from "react";

// Add this interface at the top of the file
interface ChatHistory {
  id: string;
  name: string;
  user_id: string;
}

interface HistoryViewProps {
  onChatSelect: (chatId: string) => void;
}

export default function HistoryView({ onChatSelect }: HistoryViewProps) {
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await fetch(
          `https://bart-api-bd05237bdea5.herokuapp.com/chats/${localStorage.getItem(
            "user_id"
          )}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch chat history");
        }

        const data = await response.json();
        setChatHistory(data);
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    };

    fetchChatHistory();
  }, []);

  return (
    <div className="bg-black text-white w-[300px] py-10 h-full">
      <h1 className="opacity-80 text-white text-[20px] font-medium mb-7">
        History
      </h1>

      <div className="relative mb-4">
        <input
          type="search"
          placeholder="Search"
          className="w-[90%] p-4 rounded-full bg-zinc-900 border-none  text-gray-300 placeholder:text-gray-500"
        />
      </div>

      <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-200px)]">
        <section>
          <h2 className="text-sm text-[#fff] opacity-30 mb-2">TODAY</h2>
          <div className="space-y-4">
            {chatHistory.map((chat) => (
              <p
                key={chat.id}
                className="text-[#fff] opacity-80 cursor-pointer hover:bg-zinc-800 p-2 rounded"
                onClick={() => onChatSelect(chat.id)}
              >
                {chat.name}
              </p>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
