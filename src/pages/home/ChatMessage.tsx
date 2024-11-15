// import React, { useState, useCallback } from "react";
// import ChatLogo from "../../assets/Genie.svg";
// import VerifyAuth from "./VerifyAuth";
// import { askBart, verifyOTP } from "./api";
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
//   chatId: string;
//   onNewMessage: (message: Message) => void;
// }

// const ChatMessage: React.FC<ChatMessageProps> = React.memo(
//   ({ message, chatId, onNewMessage }) => {
//     const profilePhoto =
//       "https://face-authen.s3.us-east-1.amazonaws.com/facialdata/profile_images/gauravsharma@yanthraa.com.jpg";
//     const [showAuthVideoCard, setShowAuthVideoCard] = useState(false);
//     const [showOtpInputCard, setShowOtpInputCard] = useState(false);
//     const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);

//     const handleVerificationComplete = useCallback(async () => {
//       setShowAuthVideoCard(false);

//       try {
//         // Create user message for verification success
//         const userMessage: Message = {
//           text: "Facial Recognition Verified",
//           isUserMessage: true,
//           timestamp: new Date().toLocaleTimeString(),
//           button_display: false,
//           number_of_buttons: 0,
//           button_text: [],
//         };
//         onNewMessage(userMessage);

//         const result = await askBart({
//           question: "verified_success",
//           user_id: localStorage.getItem("user_id") || "",
//           chat_id: localStorage.getItem("chat_id") || "",
//         });
//         localStorage.setItem("chat_id", result.chat_id);

//         const botMessage: Message = {
//           text: result.answer || "No response received",
//           isUserMessage: false,
//           timestamp: new Date().toLocaleTimeString(),
//           button_display: result.display_settings?.button_display || false,
//           number_of_buttons:
//             result.display_settings?.options?.buttons?.length || 0,
//           button_text: result.display_settings?.options?.buttons || [],
//         };

//         onNewMessage(botMessage);
//       } catch (error) {
//         console.error("API Error:", error);
//       }
//     }, [chatId, onNewMessage]);

//     const handleButtonClick = async (button: string) => {
//       if (button.toLowerCase() === "facial recognition") {
//         setShowAuthVideoCard(true);
//       } else if (button.toLowerCase() === "submit") {
//         setShowOtpInputCard(true);
//       } else {
//         // Create and add user message for button click
//         const userMessage: Message = {
//           text: button,
//           isUserMessage: true,
//           timestamp: new Date().toLocaleTimeString(),
//           button_display: false,
//           number_of_buttons: 0,
//           button_text: [],
//         };
//         onNewMessage(userMessage);

//         try {
//           const result = await askBart({
//             question: button,
//             user_id: localStorage.getItem("user_id") || "",
//             chat_id: localStorage.getItem("chat_id") || "",
//           });
//           localStorage.setItem("chat_id", result.chat_id);

//           const botMessage: Message = {
//             text: result.answer || "No response received",
//             isUserMessage: false,
//             timestamp: new Date().toLocaleTimeString(),
//             button_display: result.display_settings?.button_display || false,
//             number_of_buttons:
//               result.display_settings?.options?.buttons?.length || 0,
//             button_text: result.display_settings?.options?.buttons || [],
//           };

//           onNewMessage(botMessage);
//         } catch (error) {
//           console.error("API Error:", error);
//         }
//       }
//     };
//     const handleOtpSubmit = async () => {
//       setShowOtpInputCard(false);

//       try {
//         // Join the OTP array into a single string
//         const otpString = otp.join("");

//         const result = await verifyOTP({
//           otp: parseInt(otpString),
//           email: localStorage.getItem("email") || "",
//           chat_id: localStorage.getItem("chat_id") || "",
//         });

//         // Create user message for OTP submission
//         const userMessage: Message = {
//           text: otpString,
//           isUserMessage: true,
//           timestamp: new Date().toLocaleTimeString(),
//           button_display: false,
//           number_of_buttons: 0,
//           button_text: [],
//         };
//         onNewMessage(userMessage);

//         if (result.answer) {
//           // Create bot message directly from OTP verification response
//           const botMessage: Message = {
//             text: result.answer || "No response received",
//             isUserMessage: false,
//             timestamp: new Date().toLocaleTimeString(),
//             button_display: result.display_settings?.button_display || false,
//             number_of_buttons:
//               result.display_settings?.options?.buttons?.length || 0,
//             button_text: result.display_settings?.options?.buttons || [],
//           };

//           onNewMessage(botMessage);
//         } else {
//           // If OTP verification failed
//           const errorMessage: Message = {
//             text: "OTP verification failed. Please try again.",
//             isUserMessage: false,
//             timestamp: new Date().toLocaleTimeString(),
//             button_display: false,
//             number_of_buttons: 0,
//             button_text: [],
//           };
//           onNewMessage(errorMessage);
//         }
//       } catch (error) {
//         console.error("OTP verification error:", error);
//         const errorMessage: Message = {
//           text:
//             error instanceof Error ? error.message : "OTP verification failed",
//           isUserMessage: false,
//           timestamp: new Date().toLocaleTimeString(),
//           button_display: false,
//           number_of_buttons: 0,
//           button_text: [],
//         };
//         onNewMessage(errorMessage);
//       }
//     };

//     return (
//       <div
//         className={`flex items-start mb-5 w-full ${
//           message.isUserMessage ? "flex-row-reverse" : "flex-row"
//         }`}
//       >
//         <div
//           className={`flex items-start ${
//             message.isUserMessage ? "flex-row-reverse" : "flex-row"
//           } w-full`}
//         >
//           <img
//             src={message.isUserMessage ? profilePhoto : ChatLogo}
//             alt={message.isUserMessage ? "User" : "BART Genie"}
//             className={`w-8 h-8 rounded-full object-cover ${
//               message.isUserMessage ? "ml-2" : "mr-2"
//             }`}
//           />
//           <div
//             className={`flex-1 ${
//               message.isUserMessage ? "text-right" : "text-left"
//             }`}
//           >
//             <div
//               className={`flex items-center ${
//                 message.isUserMessage ? "justify-end" : "justify-start"
//               }`}
//             >
//               <span className="text-sm font-semibold mr-2 text-white">
//                 {message.isUserMessage ? "Gaurav" : "BART Genie"}
//               </span>
//               <span className="w-1 h-1 bg-white rounded-full mx-1"></span>
//               <span className="text-xs text-gray-400">{message.timestamp}</span>
//             </div>
//             <div className="mt-2 text-sm text-white">{message.text}</div>
//             {message.button_display && (
//               <div className="mt-2 text-sm text-white flex flex-row gap-2">
//                 {message.button_text.map((button, index) => (
//                   <div
//                     key={index}
//                     className="border-2 border-white rounded-md cursor-pointer"
//                     onClick={() => handleButtonClick(button)}
//                   >
//                     {button}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//         {showAuthVideoCard && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="relative">
//               <button
//                 onClick={() => setShowAuthVideoCard(false)}
//                 className="absolute top-2 right-2 text-white hover:text-gray-300"
//               >
//                 ✕
//               </button>
//               <VerifyAuth
//                 onVerificationComplete={handleVerificationComplete}
//                 chatId={chatId}
//               />
//             </div>
//           </div>
//         )}
//         {showOtpInputCard && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="relative">
//               <button
//                 onClick={() => setShowOtpInputCard(false)}
//                 className="absolute top-2 right-2 text-white hover:text-gray-300 z-10"
//               >
//                 ✕
//               </button>
//               <OTPInputCard
//                 onSubmitOTP={handleOtpSubmit}
//                 otp={otp}
//                 setOtp={setOtp}
//               />
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   }
// );

// export default ChatMessage;

import React, { useState, useCallback } from "react";
import ChatLogo from "../../assets/Genie.svg";
import VerifyAuth from "./VerifyAuth";
import { askBart, verifyOTP } from "./api";

interface Message {
  text: string;
  isUserMessage: boolean;
  timestamp: string;
  button_display: boolean;
  number_of_buttons: number;
  button_text: string[];
  showOtpInput?: boolean;
}

interface ChatMessageProps {
  message: Message;
  chatId: string;
  onNewMessage: (message: Message) => void;
}

interface InlineOTPCardProps {
  onSubmitOTP: (otp: string) => void;
  otp: string[];
  setOtp: React.Dispatch<React.SetStateAction<string[]>>;
}

const InlineOTPCard: React.FC<InlineOTPCardProps> = ({
  onSubmitOTP,
  otp,
  setOtp,
}) => {
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>(
    Array(6).fill(null)
  );

  React.useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleSubmit = useCallback(() => {
    if (otp.every((digit: string) => digit !== "")) {
      onSubmitOTP(otp.join(""));
    }
  }, [otp, onSubmitOTP]);

  const handleChange = useCallback(
    (index: number, value: string) => {
      const newOtp = [...otp];
      newOtp[index] = value.slice(-1);
      setOtp(newOtp);

      if (value && index < otp.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    [otp, setOtp]
  );

  const handleKeyDown = useCallback(
    (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Backspace") {
        event.preventDefault();
        if (!otp[index] && index > 0) {
          inputRefs.current[index - 1]?.focus();
          const updatedOtp = [...otp];
          updatedOtp[index - 1] = "";
          setOtp(updatedOtp);
        } else {
          const updatedOtp = [...otp];
          updatedOtp[index] = "";
          setOtp(updatedOtp);
        }
      } else if (event.key === "Enter") {
        handleSubmit();
      }
    },
    [otp, setOtp, handleSubmit]
  );

  return (
    <div className="mt-4">
      <div className="bg-gray-800 p-4 rounded-lg">
        <p className="text-gray-200 mb-3">Please enter below</p>
        <div className="flex space-x-2 justify-start mb-4">
          {otp.map((value: string, index: number) => (
            <input
              key={index}
              type="text"
              inputMode="numeric"
              pattern="\d*"
              value={value}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onFocus={(e) => e.target.select()}
              maxLength={1}
              ref={(el) => (inputRefs.current[index] = el)}
              className="w-12 h-12 text-center bg-gray-700 text-white border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-lg"
            />
          ))}
        </div>
        <button
          onClick={handleSubmit}
          className="w-32 py-2 bg-gray-700 text-white rounded-lg hover:opacity-90 transition-opacity"
          style={{ background: "linear-gradient(90deg, #f7a8a8, #bf5fe1)" }}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

// interface VerifyAuthProps {
//   onVerificationComplete: () => Promise<void>;
//   chatId: string;
// }

const ChatMessage: React.FC<ChatMessageProps> = React.memo(
  ({ message, onNewMessage }) => {
    const profilePhoto = "https://avatar.vercel.sh/jill";
    const [showAuthVideoCard, setShowAuthVideoCard] = useState(false);
    const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
    const [clickedButton, setClickedButton] = useState<string | null>(null);

    const handleVerificationComplete = useCallback(async () => {
      setShowAuthVideoCard(false);

      try {
        const userMessage: Message = {
          text: "Facial Recognition Verified",
          isUserMessage: true,
          timestamp: new Date().toLocaleTimeString(),
          button_display: false,
          number_of_buttons: 0,
          button_text: [],
        };
        onNewMessage(userMessage);

        const result = await askBart({
          question: "verified_success",
          user_id: localStorage.getItem("user_id") || "",
          chat_id: localStorage.getItem("chat_id") || "",
        });
        localStorage.setItem("chat_id", result.chat_id);

        const botMessage: Message = {
          text: result.answer || "No response received",
          isUserMessage: false,
          timestamp: new Date().toLocaleTimeString(),
          button_display: result.display_settings?.button_display || false,
          number_of_buttons:
            result.display_settings?.options?.buttons?.length || 0,
          button_text: result.display_settings?.options?.buttons || [],
        };

        onNewMessage(botMessage);
      } catch (error) {
        console.error("API Error:", error);
      }
    }, [onNewMessage]);

    const handleButtonClick = async (button: string) => {
      setClickedButton(button);
      if (button.toLowerCase() === "facial recognition") {
        setShowAuthVideoCard(true);
      } else {
        const userMessage: Message = {
          text: button,
          isUserMessage: true,
          timestamp: new Date().toLocaleTimeString(),
          button_display: false,
          number_of_buttons: 0,
          button_text: [],
        };
        onNewMessage(userMessage);

        try {
          const result = await askBart({
            question: button,
            user_id: localStorage.getItem("user_id") || "",
            chat_id: localStorage.getItem("chat_id") || "",
          });
          localStorage.setItem("chat_id", result.chat_id);

          const botMessage: Message = {
            text: result.answer || "No response received",
            isUserMessage: false,
            timestamp: new Date().toLocaleTimeString(),
            button_display: result.display_settings?.button_display || false,
            number_of_buttons:
              result.display_settings?.options?.buttons?.length || 0,
            button_text: result.display_settings?.options?.buttons || [],
          };

          onNewMessage(botMessage);
        } catch (error) {
          console.error("API Error:", error);
        }
      }
    };

    const handleOtpSubmit = async (otpString: string) => {
      try {
        // Display "Done" as the user's message
        const userMessage: Message = {
          text: "Done", // Show "Done" instead of the OTP
          isUserMessage: true,
          timestamp: new Date().toLocaleTimeString(),
          button_display: false,
          number_of_buttons: 0,
          button_text: [],
        };
        onNewMessage(userMessage);

        // Send the actual OTP to the backend
        const result = await verifyOTP({
          otp: parseInt(otpString), // Send actual OTP to the backend
          email: localStorage.getItem("email") || "",
          chat_id: localStorage.getItem("chat_id") || "",
        });

        // Display the response from the backend
        const botMessage: Message = {
          text: result.answer || "No response received",
          isUserMessage: false,
          timestamp: new Date().toLocaleTimeString(),
          button_display: result.display_settings?.button_display || false,
          number_of_buttons:
            result.display_settings?.options?.buttons?.length || 0,
          button_text: result.display_settings?.options?.buttons || [],
        };

        onNewMessage(botMessage);
      } catch (error) {
        const errorMessage: Message = {
          text:
            error instanceof Error ? error.message : "OTP verification failed",
          isUserMessage: false,
          timestamp: new Date().toLocaleTimeString(),
          button_display: false,
          number_of_buttons: 0,
          button_text: [],
        };
        onNewMessage(errorMessage);
      }
    };

    return (
      <div className="flex items-start mb-8 w-full text-left">
        <div className="flex items-start w-full">
          <img
            src={message.isUserMessage ? profilePhoto : ChatLogo}
            alt={message.isUserMessage ? "User" : "BART Genie"}
            className={`w-8 h-8 rounded-full object-cover ${
              message.isUserMessage ? "mx-2" : "mx-2"
            }`}
          />
          <div className="flex-1 flex">
            {(message.button_display ||
              message.text.includes("verification code")) && (
              <div
                className="w-1 h-auto mr-2"
                style={{
                  background: "linear-gradient(90deg, #f7a8a8, #bf5fe1)",
                  borderRadius: "4px",
                }}
              ></div>
            )}
            <div>
              <div className="flex items-center justify-start">
                <span className="text-sm font-semibold mr-2 text-white">
                  {message.isUserMessage
                    ? localStorage.getItem("name") || "User"
                    : "BART Genie"}
                </span>
                <span className="w-1 h-1 bg-white rounded-full mx-1"></span>
                <span className="text-xs text-gray-400">
                  {message.timestamp}
                </span>
              </div>
              <div className="mt-2 text-sm text-white">{message.text}</div>
              {message.text.includes("verification code") && (
                <InlineOTPCard
                  onSubmitOTP={handleOtpSubmit}
                  otp={otp}
                  setOtp={setOtp}
                />
              )}
              {message.button_display &&
                !message.text.includes("verification code") && (
                  <div className="mt-2 text-sm flex flex-row gap-2">
                    {message.button_text.map((button, index) => (
                      <button
                        key={index}
                        className={`px-4 py-2 rounded-md cursor-pointer ${
                          clickedButton === button
                            ? "bg-gradient-to-r from-[#f7a8a8] to-[#bf5fe1] text-white"
                            : "bg-gray-700 text-white"
                        }`}
                        onClick={() => handleButtonClick(button)}
                      >
                        {button}
                      </button>
                    ))}
                  </div>
                )}
            </div>
          </div>
        </div>
        {showAuthVideoCard && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="relative">
              <button
                onClick={() => setShowAuthVideoCard(false)}
                className="absolute top-[-30px] right-1 text-white hover:text-gray-300"
              >
                ✕
              </button>
              <VerifyAuth
                onVerificationComplete={handleVerificationComplete}
                // chatId={chatId}
              />
            </div>
          </div>
        )}
      </div>
    );
  }
);

export default ChatMessage;
