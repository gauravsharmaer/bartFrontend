import React from "react";
import ChatLogo from "../../assets/Genie.svg";

interface Message {
  text: string;
  isUserMessage: boolean;
  timestamp: string;
}

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = React.memo(({ message }) => {
  const profilePhoto =
    "https://face-authen.s3.us-east-1.amazonaws.com/facialdata/profile_images/gauravsharma@yanthraa.com.jpg";

  return (
    <div
      className={`flex items-start mb-5 w-full ${
        message.isUserMessage ? "flex-row-reverse" : "flex-row"
      }`}
    >
      <div
        className={`flex items-start ${
          message.isUserMessage ? "flex-row-reverse" : "flex-row"
        } w-full`}
      >
        <img
          src={message.isUserMessage ? profilePhoto : ChatLogo}
          alt={message.isUserMessage ? "User" : "BART Genie"}
          className={`w-8 h-8 rounded-full object-cover ${
            message.isUserMessage ? "ml-2" : "mr-2"
          }`}
        />
        <div
          className={`flex-1 ${
            message.isUserMessage ? "text-right" : "text-left"
          }`}
        >
          <div
            className={`flex items-center ${
              message.isUserMessage ? "justify-end" : "justify-start"
            }`}
          >
            <span className="text-sm font-semibold mr-2">
              {message.isUserMessage ? "Gaurav" : "BART Genie"}
            </span>
            <span className="w-1 h-1 bg-white rounded-full mx-1"></span>
            <span className="text-xs text-gray-400">{message.timestamp}</span>
          </div>
          <div className="mt-2 text-sm text-white">{message.text}</div>
        </div>
      </div>
    </div>
  );
});

export default ChatMessage;
