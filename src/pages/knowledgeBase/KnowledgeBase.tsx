// import React, { useState, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import {
//   BedrockAgentRuntimeClient,
//   InvokeAgentCommand,
// } from "@aws-sdk/client-bedrock-agent-runtime";
// import { v4 as uuidv4 } from "uuid";
// import axios from "axios";
// import FacialAuthComponent from "../../pages/passwordResetAgent/FacialAuthComponent";
// // import ChatLogo from "../../assets/Genie.svg";
// import Button from "@mui/material/Button";
// import Menu from "@mui/material/Menu";
// import MenuItem from "@mui/material/MenuItem";
// import LogoutIcon from "../../assets/Genie.svg";
// import DB from "../../assets/computer-settings.svg";
// import {
//   REACT_APP_AWS_REGION,
//   REACT_APP_AWS_ACCESS_KEY_ID,
//   REACT_APP_AWS_SECRET_ACCESS_KEY,
// } from "../../config";
// import ChatMessage from "./chatMessage";
// import ChatInput from "./chatInput";

// interface Message {
//   text: string;
//   isUserMessage: boolean;
//   timestamp: string;
//   isLoading?: boolean;
// }

// const KnowledgeBase: React.FC = () => {
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [sessionId, setSessionId] = useState<string>("");
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [showFacialAuth, setShowFacialAuth] = useState<boolean>(false);
//   const [facialAuthLink, setFacialAuthLink] = useState<string>("");
//   const [isVerificationCompleted, setIsVerificationCompleted] =
//     useState<boolean>(false);
//   const [hasSentVerificationMessage, setHasSentVerificationMessage] =
//     useState<boolean>(false);
//   const [initialPromptProcessed, setInitialPromptProcessed] =
//     useState<boolean>(false);

//   const navigate = useNavigate();
//   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
//   const open = Boolean(anchorEl);
//   const location = useLocation();

//   const initialPrompt = "Hey BARTGenie, I have a question related to BART";

//   useEffect(() => {
//     setSessionId(uuidv4());
//   }, []);

//   useEffect(() => {
//     if (sessionId && !initialPromptProcessed) {
//       handleMessageSend(initialPrompt, true);
//     }
//   }, [sessionId, initialPromptProcessed]);

//   useEffect(() => {
//     if (isVerificationCompleted && !hasSentVerificationMessage) {
//       handleMessageSend("User verified successfully.");
//       setHasSentVerificationMessage(true);
//     }
//   }, [isVerificationCompleted, hasSentVerificationMessage]);

//   const handleAuthComplete = (): void => {
//     setShowFacialAuth(false);
//     setIsVerificationCompleted(true);
//   };

//   const handleAuthClose = (): void => {
//     setShowFacialAuth(false);
//   };

//   const getCurrentTime = (): string => {
//     return new Date().toLocaleTimeString([], {
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   const createMessage = (text: string, isUserMessage: boolean): Message => ({
//     text,
//     isUserMessage,
//     timestamp: getCurrentTime(),
//   });

//   const handleMessageSend = async (
//     input: string,
//     displayMessage: boolean = true
//   ): Promise<void> => {
//     if (!displayMessage && initialPromptProcessed) return;

//     setIsLoading(true);
//     try {
//       if (displayMessage) {
//         setMessages((prevMessages) => [
//           ...prevMessages,
//           createMessage(input, true),
//           {
//             text: "Loading...",
//             isUserMessage: false,
//             isLoading: true,
//             timestamp: getCurrentTime(),
//           },
//         ]);
//         await storeMessage(input, true);
//       }

//       const client = new BedrockAgentRuntimeClient({
//         region: REACT_APP_AWS_REGION,
//         credentials: {
//           accessKeyId: REACT_APP_AWS_ACCESS_KEY_ID,
//           secretAccessKey: REACT_APP_AWS_SECRET_ACCESS_KEY,
//         },
//       });

//       const response = await client.send(command);
//       let fullResponse = "";
//       const decoder = new TextDecoder("utf-8");

//       if (response.completion) {
//         for await (const event of response.completion) {
//           if (event.chunk && event.chunk.bytes) {
//             fullResponse += decoder.decode(event.chunk.bytes, { stream: true });
//           }
//         }
//         await processAndDisplayResponse(fullResponse, displayMessage);
//         setInitialPromptProcessed(true);
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       setMessages((prevMessages) => [
//         ...prevMessages.slice(0, -1),
//         createMessage("An error occurred while fetching the response.", false),
//       ]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const processAndDisplayResponse = async (
//     fullResponse: string,
//     displayMessage: boolean
//   ): Promise<void> => {
//     if (displayMessage) {
//       setMessages((prevMessages) => [
//         ...prevMessages.slice(0, -1),
//         createMessage(fullResponse, false),
//       ]);
//       await storeMessage(fullResponse, false);
//     }
//   };

//   const storeMessage = async (
//     message: string,
//     isUserMessage: boolean
//   ): Promise<void> => {
//     try {
//       const username = "gauravsharma@yanthraa.com";
//       const password = "gaurav@123";
//       if (!username || !password) {
//         console.error("Username or password not found in localStorage");
//         return;
//       }
//       await axios.post(
//         "https://n6nf7fbb02.execute-api.us-east-1.amazonaws.com/prod/chat",
//         {
//           action: "store",
//           email: username,
//           password: password,
//           sessionId: sessionId,
//           message: message,
//           isUserMessage: isUserMessage,
//         }
//       );
//     } catch (error) {
//       console.error("Error storing message:", error);
//     }
//   };

//   return (
//     <div className="flex w-[74vw] p-10">
//       <main className="flex-1">
//         <div className="h-full my-2.5 overflow-hidden w-full">
//           <div className="flex items-center justify-center relative p-4">
//             <div className="flex items-center flex-grow justify-center">
//               <img
//                 src={DB}
//                 alt="Database Icon"
//                 className="mr-2 border-r border-b border-gray-600 rounded"
//               />
//               <h2 className="font-sans text-lg text-center text-gray-400 p-2">
//                 Connect to the Knowledge Base
//               </h2>
//             </div>
//             <div className="ml-auto">
//               <Button
//                 onClick={(event: React.MouseEvent<HTMLButtonElement>) =>
//                   setAnchorEl(event.currentTarget)
//                 }
//                 className="bg-transparent border-none"
//               >
//                 <img src={LogoutIcon} alt="Logout" className="w-8 h-8" />
//               </Button>
//               <Menu
//                 anchorEl={anchorEl}
//                 open={open}
//                 onClose={() => setAnchorEl(null)}
//                 className="mt-2"
//               >
//                 <MenuItem
//                   onClick={() => navigate("/login")}
//                   className="text-white bg-gray-700 hover:bg-gray-600"
//                 >
//                   Logout
//                 </MenuItem>
//               </Menu>
//             </div>
//           </div>

//           <div className="text-white overflow-auto h-[calc(100vh-200px)] scrollbar-hide w-full">
//             {messages.map((message, index) => (
//               <ChatMessage key={index} message={message} />
//             ))}
//             <div className="mt-20">
//               <ChatInput onSend={handleMessageSend} isLoading={isLoading} />
//             </div>
//             {showFacialAuth && (
//               <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//                 <FacialAuthComponent
//                   onClose={handleAuthClose}
//                   onComplete={handleAuthComplete}
//                 />
//               </div>
//             )}
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default KnowledgeBase;
