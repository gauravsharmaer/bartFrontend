import React, { useEffect } from "react";
import ChatLogo from "../../assets/Genie.svg";
import OptionCard from "./OptionCard";
import OTPInputCard from "./OTPInputCard";
import TicketCard from "./TicketCard";

interface Message {
  text: string | JSX.Element;
  isUserMessage: boolean;
  timestamp: string;
  showOptions?: boolean;
  showOTP?: boolean;
  showVideoVerification?: boolean;
  link?: string | null;
  videoVerificationCard?: JSX.Element | null;
  ticketInfo?: {
    showTicket: boolean;
    assignedTo: string;
    ticketNo: string;
    link: string;
    time: string;
  } | null;
}

interface Option {
  id: number;
  text: string;
}

interface ChatMessageProps {
  message: Message;
  options: Option[];
  selectedOption: number | null;
  handleOptionClick: (option: Option) => void;
  otp: string[];
  setOtp: React.Dispatch<React.SetStateAction<string[]>>;
  handleMessageSend: (
    displayText: string,
    displayMessage: boolean,
    actualOTP: string | null
  ) => void;
  scrollToBottom: () => void;
}

const ChatMessage: React.FC<ChatMessageProps> = React.memo(
  ({
    message,
    options,
    selectedOption,
    handleOptionClick,
    otp,
    setOtp,
    handleMessageSend,
    scrollToBottom,
  }) => {
    const profilePhoto =
      "https://face-authen.s3.us-east-1.amazonaws.com/facialdata/profile_images/gauravsharma@yanthraa.com.jpg";
    const fullName = "gaurav";
    const userName = "gauravsharma@yanthraa.com";

    useEffect(() => {
      scrollToBottom();
    }, [message, scrollToBottom]);

    return (
      <div className="flex items-start mb-5 w-full">
        <div
          className={`flex items-start ${
            message.isUserMessage ? "justify-end" : "justify-start"
          } w-full`}
        >
          <img
            src={message.isUserMessage ? profilePhoto : ChatLogo}
            alt={message.isUserMessage ? userName : "BART Genie"}
            className="w-8 h-8 rounded-full mr-2 object-cover"
          />
          <div className="flex-1">
            <div className="flex items-center">
              <span className="text-sm font-semibold mr-2">
                {message.isUserMessage ? fullName || userName : "BART Genie"}
              </span>
              <span className="w-1 h-1 bg-white rounded-full mx-1"></span>
              <span className="text-xs text-gray-400">
                {message.timestamp || " "}
              </span>
            </div>
            <div className="flex gap-2">
              {(message.showOptions ||
                message.showOTP ||
                message.showVideoVerification ||
                message.ticketInfo) && (
                <div className="w-1.5 rounded-lg bg-gradient-to-b from-purple-600 to-pink-400"></div>
              )}
              <div>
                <div className="mt-2 text-sm">{message.text}</div>
                {message.showOptions && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {options.map((option) => (
                      <OptionCard
                        key={option.id}
                        option={option}
                        onClick={() => handleOptionClick(option)}
                        isSelected={selectedOption === option.id}
                      />
                    ))}
                  </div>
                )}
                {message.showOTP && (
                  <OTPInputCard
                    otp={otp}
                    setOtp={setOtp}
                    onSubmitOTP={(displayText: string) =>
                      handleMessageSend(displayText, true, otp.join(""))
                    }
                  />
                )}
                {message.showVideoVerification && message.videoVerificationCard}
                {message.ticketInfo && message.ticketInfo.showTicket && (
                  <TicketCard {...message.ticketInfo} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default ChatMessage;
