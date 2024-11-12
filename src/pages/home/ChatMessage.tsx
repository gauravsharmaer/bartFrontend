// import React, { useState, useCallback } from "react";
// import ChatLogo from "../../assets/Genie.svg";
// import OTPInputCard from "./OTPInputCard";

// interface Message {
//   text: string;
//   isUserMessage: boolean;
//   timestamp: string;
//   button_display: boolean;
//   number_of_buttons: number;
//   button_text: string[];
// }

// interface ChatMessageProps {
//   message: Message;
// }

// const ChatMessage: React.FC<ChatMessageProps> = React.memo(({ message }) => {
//   const profilePhoto =
//     "https://face-authen.s3.us-east-1.amazonaws.com/facialdata/profile_images/gauravsharma@yanthraa.com.jpg";
//   const [showOTPCard, setShowOTPCard] = useState(false);
//   const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));

//   const handleVerificationComplete = useCallback((displayText: string) => {
//     setShowOTPCard(false);
//     // Handle the OTP verification result here
//   }, []);

//   const handleButtonClick = (button: string) => {
//     setShowOTPCard(true);
//   };

//   return (
//     <div
//       className={`flex items-start mb-5 w-full ${
//         message.isUserMessage ? "flex-row-reverse" : "flex-row"
//       }`}
//     >
//       <div
//         className={`flex items-start ${
//           message.isUserMessage ? "flex-row-reverse" : "flex-row"
//         } w-full`}
//       >
//         <img
//           src={message.isUserMessage ? profilePhoto : ChatLogo}
//           alt={message.isUserMessage ? "User" : "BART Genie"}
//           className={`w-8 h-8 rounded-full object-cover ${
//             message.isUserMessage ? "ml-2" : "mr-2"
//           }`}
//         />
//         <div
//           className={`flex-1 ${
//             message.isUserMessage ? "text-right" : "text-left"
//           }`}
//         >
//           <div
//             className={`flex items-center ${
//               message.isUserMessage ? "justify-end" : "justify-start"
//             }`}
//           >
//             <span className="text-sm font-semibold mr-2">
//               {message.isUserMessage ? "Gaurav" : "BART Genie"}
//             </span>
//             <span className="w-1 h-1 bg-white rounded-full mx-1"></span>
//             <span className="text-xs text-gray-400">{message.timestamp}</span>
//           </div>
//           <div className="mt-2 text-sm text-white">{message.text}</div>
//           {message.button_display && (
//             <div className="mt-2 text-sm text-white flex flex-row gap-2">
//               {message.button_text.map((button, index) => (
//                 <div
//                   key={index}
//                   className="border-2 border-white rounded-md"
//                   onClick={() => handleButtonClick(button)}
//                 >
//                   {button}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//       {showOTPCard && (
//         <OTPInputCard
//           onSubmitOTP={handleVerificationComplete}
//           otp={otp}
//           setOtp={setOtp}
//         />
//       )}
//     </div>
//   );
// });

// export default ChatMessage;

import React, { useState, useCallback } from "react";
import ChatLogo from "../../assets/Genie.svg";
import VerifyAuth from "./VerifyAuth";

interface Message {
  text: string;
  isUserMessage: boolean;
  timestamp: string;
  button_display: boolean;
  number_of_buttons: number;
  button_text: string[];
}

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = React.memo(({ message }) => {
  const profilePhoto =
    "https://face-authen.s3.us-east-1.amazonaws.com/facialdata/profile_images/gauravsharma@yanthraa.com.jpg";
  const [showAuthVideoCard, setShowAuthVideoCard] = useState(false);

  const handleVerificationComplete = useCallback(() => {
    setShowAuthVideoCard(false);
  }, []);

  const handleButtonClick = (button: string) => {
    setShowAuthVideoCard(true);
  };

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
          {message.button_display && (
            <div className="mt-2 text-sm text-white flex flex-row gap-2">
              {message.button_text.map((button, index) => (
                <div
                  key={index}
                  className="border-2 border-white rounded-md"
                  onClick={() => handleButtonClick(button)}
                >
                  {button}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {showAuthVideoCard && (
        <VerifyAuth onVerificationComplete={handleVerificationComplete} />
      )}
    </div>
  );
});

export default ChatMessage;
