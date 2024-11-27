import HistoryView from "../../components/HistoryNav";
import ChatLogo from "../../assets/Genie.svg";
import "../../../src/App.css";
import { useState } from "react";

interface ChatMessage {
  id: string;
  question: string;
  answer: string;
}

const History = () => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  const handleGetChat = async (chatId: string) => {
    try {
      const response = await fetch(
        `https://bart-api-bd05237bdea5.herokuapp.com/chat_histories/${chatId}`,
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
            <div key={message.id}>
              {/* User Message */}
              <div className="flex items-start mb-8 w-full text-left">
                <div className="flex items-start w-full">
                  <img
                    src="https://avatar.vercel.sh/jill"
                    alt="User"
                    className="w-8 h-8 rounded-full object-cover mx-2"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-start">
                      <span className="text-sm font-semibold mr-2 text-white">
                        {localStorage.getItem("name") || "User"}
                      </span>
                      <span className="w-1 h-1 bg-white rounded-full mx-1"></span>
                      <span className="text-xs text-gray-400">
                        {new Date().toLocaleTimeString()}{" "}
                        {/* You might want to add timestamp to your API response */}
                      </span>
                    </div>
                    <div className="mt-2 text-sm text-white">
                      {message.question}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bot Message */}
              <div className="flex items-start mb-8 w-full text-left">
                <div className="flex items-start w-full">
                  <img
                    src={ChatLogo}
                    alt="BART Genie"
                    className="w-8 h-8 rounded-full object-cover mx-2"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-start">
                      <span className="text-sm font-semibold mr-2 text-white">
                        BART Genie
                      </span>
                      <span className="w-1 h-1 bg-white rounded-full mx-1"></span>
                      <span className="text-xs text-gray-400">
                        {new Date().toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="mt-2 text-sm text-white">
                      {message.answer}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default History;
