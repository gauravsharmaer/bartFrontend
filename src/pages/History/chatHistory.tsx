import React from "react";
import ChatLogo from "../../assets/Genie.svg";
import { ChatMessageProps } from "./Interface/interface";

const ChatMessage: React.FC<ChatMessageProps> = React.memo(({ message }) => {
  const profilePhoto = "https://avatar.vercel.sh/jill";

  return (
    <div key={message.id}>
      {/* User Message */}
      <div className="flex items-start mb-8 w-full text-left">
        <div className="flex items-start w-full">
          <img
            src={profilePhoto}
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
                {new Date().toLocaleTimeString()}
              </span>
            </div>
            <div className="mt-2 text-sm text-white">{message.question}</div>
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
            <div className="mt-2 text-sm text-white">{message.answer}</div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ChatMessage;
