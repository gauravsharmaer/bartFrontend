// import React from "react";
// import ChatLogo from "../../assets/Genie.svg";
// import DotLoader from "../passwordResetAgent/DotLoader"; // Make sure to import or create this component

// interface Message {
//   text: string | JSX.Element;
//   isUserMessage: boolean;
//   timestamp: string;
//   isLoading?: boolean;
// }

// interface ChatMessageProps {
//   message: Message;
//   isTyping: boolean;
// }

// const ChatMessage: React.FC<ChatMessageProps> = ({ message, isTyping }) => {
//   const userName = "gauravsharma@yanthraa.com";
//   const profilePhoto =
//     "https://face-authen.s3.us-east-1.amazonaws.com/facialdata/profile_images/gauravsharma@yanthraa.com.jpg";
//   const fullName = "gaurav";

//   return (
//     <div className="flex items-start mb-5 w-full">
//       <div className="flex items-start justify-start w-full">
//         <img
//           src={message.isUserMessage ? profilePhoto : ChatLogo}
//           alt={message.isUserMessage ? userName : "BART Genie"}
//           className="w-8 h-8 rounded-full mr-2 object-cover"
//         />
//         <div className="flex-1">
//           <div className="flex items-center">
//             <span className="text-sm font-semibold mr-2">
//               {message.isUserMessage ? fullName || userName : "BART Genie"}
//             </span>
//             <span className="w-1 h-1 bg-white rounded-full mx-1"></span>
//             <span className="text-xs text-gray-400">
//               {message.timestamp || " "}
//             </span>
//           </div>
//           <div className="mt-2 text-sm flex justify-start">
//             {isTyping ? <DotLoader /> : message.text}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatMessage;
