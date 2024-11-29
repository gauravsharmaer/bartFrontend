import HistoryView from "./HistoryNav";
import "../../../src/App.css";
import { useState } from "react";
import { chatMessage } from "../../interfaces/Interface";
import ChatMessage from "./chatHistory";
import { HistoryApiService } from "./api";
const History = () => {
  const [chatMessages, setChatMessages] = useState<chatMessage[]>([]);

  const handleGetChat = async (chatId: string) => {
    try {
      const data = await HistoryApiService.getHistory(chatId);
      setChatMessages(data);
    } catch (error) {
      console.error("Error fetching chat:", error);
    }
  };

  return (
    <div className="flex h-screen bg-black">
      <HistoryView onChatSelect={handleGetChat} />
      <div className="flex-1 p-2">
        <div className="garadientBG bg-cover bg-center w-full h-full rounded-xl flex flex-col items-center justify-start p-6 overflow-y-auto">
          {chatMessages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default History;
