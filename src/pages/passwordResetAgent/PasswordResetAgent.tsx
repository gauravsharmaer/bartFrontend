// /* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable react-hooks/exhaustive-deps */
// import React, {
//   useState,
//   useRef,
//   useEffect,
//   useCallback,
//   useMemo,
// } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { v4 as uuidv4 } from "uuid";

// import FacialAuthComponent from "./FacialAuthComponent";

// import Lock from "../../assets/password.svg";
// import { Button, Menu, MenuItem } from "@mui/material";
// import LogoutIcon from "../../assets/Genie.svg";
// import ChatInput from "./ChatInput";

// import VideoVerificationCard from "./VideoVerificationCard";

// import DotLoader from "./DotLoader";

// import ChatMessage from "./ChatMessage";

// import { Message, Option } from "./types";
// import Navbar from "../../components/Navbar";
// import {
//   createApiClient,
//   createCommand,
//   sendAndDecodeResponse,
//   storeMessage,
// } from "./api";

// import { scrollToBottom, getCurrentTime, createMessage } from "./utils";
// import { HomeBackground } from "../../components/ui/homeBackground";
// const PasswordResetAgent: React.FC = () => {
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [sessionId, setSessionId] = useState<string>("");
//   const [isSessionReady, setIsSessionReady] = useState<boolean>(false);
//   const [messages, setMessages] = useState<Message[]>([]);
//   const hasSentInitialMessage = useRef<boolean>(false);
//   const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
//   const [showOTP, setShowOTP] = useState<boolean>(false);
//   const [showFacialAuth, setShowFacialAuth] = useState<boolean>(false);
//   const [facialAuthLink, setFacialAuthLink] = useState<string>("");
//   const [hasShownVideoVerification, setHasShownVideoVerification] =
//     useState<boolean>(false);
//   const [isVerificationCompleted, setIsVerificationCompleted] =
//     useState<boolean>(false);
//   const [hasSentVerificationMessage, setHasSentVerificationMessage] =
//     useState<boolean>(false);
//   const [initialPromptProcessed, setInitialPromptProcessed] =
//     useState<boolean>(false);
//   const [selectedOption, setSelectedOption] = useState<number | null>(null);
//   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const open = Boolean(anchorEl);
//   const initialPrompt =
//     (location.state as { initialPrompt?: string })?.initialPrompt || "";
//   console.log(messages);
//   useEffect(() => {
//     setSessionId(uuidv4());
//     setIsSessionReady(true);
//   }, []);

//   const handleConfirmLogout = useCallback(() => {
//     navigate("/login");
//   }, [navigate]);

//   const handleClick = useCallback(
//     (event: React.MouseEvent<HTMLButtonElement>) => {
//       setAnchorEl(event.currentTarget);
//     },
//     []
//   );

//   const handleClose = useCallback(() => setAnchorEl(null), []);

//   const handleOptionClick = useCallback((option: Option) => {
//     setSelectedOption(option.id);
//     handleMessageSend(option.text);
//   }, []);

//   const options: Option[] = useMemo(
//     () => [
//       { id: 1, text: "Email" },
//       { id: 2, text: "Employee Portal" },
//       { id: 3, text: "HR Management" },
//       { id: 4, text: "Project Management Tools" },
//       { id: 5, text: "Other" },
//     ],
//     []
//   );

//   useEffect(() => {
//     if (messages.length > 0) {
//       setTimeout(scrollToBottom, 100);
//     }
//   }, [messages]);

//   const handleAuthComplete = useCallback(() => {
//     setShowFacialAuth(false);
//     setIsVerificationCompleted(true);
//   }, []);

//   const handleAuthClose = useCallback(() => setShowFacialAuth(false), []);

//   const typingEffect = useCallback(
//     (messageText: string, delay = 50): Promise<void> => {
//       return new Promise((resolve) => {
//         let currentIndex = 0;
//         const interval = setInterval(() => {
//           if (currentIndex < messageText.length) {
//             setMessages((prevMessages) => {
//               const newMessages = prevMessages.slice(0, -1);
//               newMessages.push({
//                 text: messageText.substring(0, currentIndex + 1),
//                 isUserMessage: false,
//                 isLoading: true,
//                 timestamp: getCurrentTime(),
//               });
//               return newMessages;
//             });
//             currentIndex++;
//           } else {
//             clearInterval(interval);
//             resolve();
//           }
//         }, delay);
//       });
//     },
//     []
//   );

//   const processAndDisplayResponse = useCallback(
//     async (fullResponse: string, displayMessage: boolean): Promise<void> => {
//       const isOptionMessage = /application|Application/.test(fullResponse);
//       const isOTPMessage =
//         /enter the OTP|invalid|expired|provide me with the OTP|OTP sent to your email/i.test(
//           fullResponse
//         );
//       const isTicketMessage = fullResponse.includes(
//         "The Jira ticket was created successfully!"
//       );
//       const isVideoVerificationMessage =
//         fullResponse.includes("video verification");
//       const videoVerificationLink = isVideoVerificationMessage
//         ? fullResponse.match(/https:\/\/\S+/)?.[0]?.split(" ")[0]
//         : null;

//       setMessages((prevMessages) => {
//         if (!displayMessage) {
//           return prevMessages;
//         }

//         const newMessages = [...prevMessages.slice(0, -1)];

//         const responseMessage = createMessage(fullResponse, false);
//         responseMessage.showOptions = isOptionMessage;
//         responseMessage.showOTP = isOTPMessage;
//         responseMessage.showVideoVerification = isVideoVerificationMessage;
//         responseMessage.link = videoVerificationLink;
//         responseMessage.videoVerificationCard = null;
//         responseMessage.ticketInfo = null;

//         if (isVideoVerificationMessage && !hasShownVideoVerification) {
//           responseMessage.videoVerificationCard = (
//             <VideoVerificationCard
//               link={videoVerificationLink || ""}
//               isVerificationCompleted={isVerificationCompleted}
//               setFacialAuthLink={setFacialAuthLink}
//               setShowFacialAuth={setShowFacialAuth}
//             />
//           );
//           setHasShownVideoVerification(true);
//         }

//         if (isTicketMessage) {
//           const linkMatch = fullResponse.match(/https:\/\/\S+/);
//           const link = linkMatch ? linkMatch[0].split(" ")[0] : "";
//           const assignedToMatch = fullResponse.match(/https:\/\/([^.\n]+)/);
//           const ticketNoMatch = link.match(/([A-Z]+-\d+)/);
//           const assignedTo = assignedToMatch
//             ? assignedToMatch[1].trim()
//             : "Unknown";
//           const ticketNo = ticketNoMatch ? ticketNoMatch[1] : "Unknown";
//           const now = new Date();
//           const time = `${now.toLocaleTimeString([], {
//             hour: "2-digit",
//             minute: "2-digit",
//           })}, ${now.toLocaleDateString()}`;

//           responseMessage.ticketInfo = {
//             showTicket: true,
//             assignedTo,
//             ticketNo,
//             link,
//             time,
//           };
//         }

//         newMessages.push(responseMessage);

//         return newMessages;
//       });

//       setShowOTP(isOTPMessage);

//       if (displayMessage) {
//         await storeMessage(fullResponse, false, sessionId);
//       }
//     },
//     [
//       isVerificationCompleted,
//       setFacialAuthLink,
//       setShowFacialAuth,
//       hasShownVideoVerification,
//       sessionId,
//     ]
//   );

//   const handleMessageSend = useCallback(
//     async (
//       input: string,
//       displayMessage = true,
//       actualOTP: string | null = null
//     ): Promise<void> => {
//       if (!isSessionReady) {
//         console.log("Session is not ready yet. Waiting...");
//         return;
//       }

//       if (!initialPromptProcessed) {
//         await handleInitialPrompt();
//         return;
//       }

//       if (
//         input === "User verified successfully." &&
//         hasSentVerificationMessage
//       ) {
//         return;
//       }

//       await processUserInput(input, displayMessage, actualOTP);
//     },
//     [
//       isSessionReady,
//       initialPromptProcessed,

//       sessionId,
//       typingEffect,
//       processAndDisplayResponse,
//       hasSentVerificationMessage,
//     ]
//   );

//   const handleInitialPrompt = async () => {
//     const initialMessage = "Hey BARTGenie, I want to reset my password";
//     setIsLoading(true);

//     setMessages((prevMessages) => [
//       ...prevMessages,
//       createMessage(initialMessage, true),
//       createLoadingMessage(),
//     ]);

//     try {
//       const fullResponse = await sendMessage(initialMessage);
//       await typingEffect(fullResponse);
//       await processAndDisplayResponse(fullResponse, true);
//       setInitialPromptProcessed(true);
//     } catch (error) {
//       handleError(error as Error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const processUserInput = async (
//     input: string,
//     displayMessage: boolean,
//     actualOTP: string | null
//   ) => {
//     setIsLoading(true);
//     try {
//       const newMessage = createUserMessage(input, actualOTP);
//       addMessageToChat(newMessage);

//       if (displayMessage) {
//         await storeMessage(actualOTP || input, true, sessionId);
//       }

//       const fullResponse = await sendMessage(actualOTP || input);

//       await typingEffect(fullResponse);
//       await processAndDisplayResponse(fullResponse, displayMessage);

//       handleVideoVerification(fullResponse);
//     } catch (error) {
//       handleError(error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const sendMessage = async (message: string) => {
//     const client = createApiClient();
//     const command = createCommand(message, sessionId);
//     return await sendAndDecodeResponse(client, command);
//   };

//   const createLoadingMessage = () => ({
//     text: <DotLoader />,
//     isUserMessage: false,
//     isLoading: true,
//     timestamp: getCurrentTime(),
//   });

//   const createUserMessage = (input: string, actualOTP: string | null) => ({
//     text: input === "Done" ? "Done" : actualOTP ? "Done" : input,
//     isUserMessage: true,
//     timestamp: getCurrentTime(),
//   });

//   const addMessageToChat = (newMessage: Message) => {
//     setMessages((prevMessages) => [
//       ...prevMessages,
//       newMessage,
//       createLoadingMessage(),
//     ]);
//   };

//   const handleVideoVerification = (fullResponse: string) => {
//     if (fullResponse.includes("video verification")) {
//       const videoVerificationLink = fullResponse
//         .match(/https:\/\/\S+/)?.[0]
//         ?.split(" ")[0];
//       if (videoVerificationLink) {
//         setFacialAuthLink(videoVerificationLink);
//         setShowFacialAuth(true);
//       }
//     }
//   };

//   const handleError = (error: Error) => {
//     console.error("Error:", error);
//     const errorMessage = "An error occurred while fetching the response.";

//     setMessages((prevMessages) => [
//       ...prevMessages.slice(0, -1),
//       {
//         text: errorMessage,
//         isUserMessage: false,
//         timestamp: getCurrentTime(),
//       },
//     ]);
//   };

//   useEffect(() => {
//     if (isSessionReady && !hasSentInitialMessage.current) {
//       handleMessageSend(initialPrompt, false);
//       hasSentInitialMessage.current = true;
//     }
//   }, [isSessionReady, initialPrompt, handleMessageSend]);

//   useEffect(() => {
//     if (isVerificationCompleted && !hasSentVerificationMessage) {
//       handleMessageSend("User verified successfully.");
//       setHasSentVerificationMessage(true);
//     }
//   }, [isVerificationCompleted, hasSentVerificationMessage, handleMessageSend]);

//   return (
//     <div className="flex w-[74vw] p-10">
//       <main className="flex-1">
//         <div className="h-full   my-2.5 overflow-hidden w-full">
//           <div className="flex items-center justify-center relative p-4">
//             <div className="flex items-center flex-grow justify-center">
//               <img
//                 src={Lock}
//                 alt="Lock"
//                 className="mr-2 border-r border-b border-gray-600 rounded"
//               />
//               <h2 className="font-sans text-lg text-center text-gray-400 p-2">
//                 Password Reset
//               </h2>
//             </div>
//             <div className="ml-auto">
//               <Button
//                 id="basic-button"
//                 aria-controls={open ? "basic-menu" : undefined}
//                 aria-haspopup="true"
//                 aria-expanded={open ? "true" : undefined}
//                 onClick={handleClick}
//               >
//                 <img src={LogoutIcon} alt="Logout" />
//               </Button>
//               <Menu
//                 id="basic-menu"
//                 anchorEl={anchorEl}
//                 open={open}
//                 onClose={handleClose}
//                 MenuListProps={{
//                   "aria-labelledby": "basic-button",
//                 }}
//               >
//                 <MenuItem onClick={handleConfirmLogout}>Logout</MenuItem>
//               </Menu>
//             </div>
//           </div>

//           <div className="text-white overflow-auto h-[calc(100vh-200px)] scrollbar-hide w-full">
//             {messages.map((message, index) => (
//               <ChatMessage
//                 key={index}
//                 message={message}
//                 options={options}
//                 selectedOption={selectedOption}
//                 handleOptionClick={handleOptionClick}
//                 otp={otp}
//                 setOtp={setOtp}
//                 handleMessageSend={handleMessageSend}
//                 scrollToBottom={scrollToBottom}
//               />
//             ))}
//             <div className="mt-20">
//               <ChatInput onSend={handleMessageSend} isLoading={isLoading} />
//             </div>

//             {showFacialAuth && (
//               <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//                 <FacialAuthComponent
//                   // link={facialAuthLink}
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

// export default React.memo(PasswordResetAgent);
