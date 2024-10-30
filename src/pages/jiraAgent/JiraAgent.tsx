// import React, { useState, useRef, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import {
//   BedrockAgentRuntimeClient,
//   InvokeAgentCommand,
// } from "@aws-sdk/client-bedrock-agent-runtime";
// import { v4 as uuidv4 } from "uuid";
// import axios from "axios";
// import FacialAuthComponent from "../components/FacialAuthComponent";
// import LeftPanel from "../components/LeftPanel";
// import "../styles/common.css";
// import Icon8 from "../assets/arrow-circle-up.svg";
// import Icon7 from "../assets/plus-circle.svg";
// import ChatLogo from "../assets/Genie.svg";
// import Profile from "../assets/profile.svg";
// import Lock from "../assets/lock.svg";
// import Button from "@mui/material/Button";
// import Menu from "@mui/material/Menu";
// import MenuItem from "@mui/material/MenuItem";
// import LogoutIcon from "../assets/Genie.svg";
// import JT from "../assets/Jiraticket.svg";
// import AWS from "aws-sdk";

// const s3 = new AWS.S3();

// interface Message {
//   text: string;
//   isUserMessage: boolean;
//   timestamp: string;
//   showOptions?: boolean;
//   showOTP?: boolean;
//   showVideoVerification?: boolean;
//   link?: string;
//   videoVerificationCard?: React.ReactNode;
//   ticketInfo?: {
//     showTicket: boolean;
//     assignedTo: string;
//     ticketNo: string;
//     link: string;
//     time: string;
//   } | null;
// }

// interface Option {
//   id: number;
//   text: string;
// }

// const Agent: React.FC = () => {
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [sessionId, setSessionId] = useState<string>("");
//   const [messages, setMessages] = useState<Message[]>([]);
//   const endOfMessagesRef = useRef<HTMLDivElement>(null);
//   const hasSentInitialMessage = useRef<boolean>(false);
//   const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
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
//   const [isActive, setIsActive] = useState<boolean>(false);
//   const [showLogoutButton, setShowLogoutButton] = useState<boolean>(false);
//   const navigate = useNavigate();
//   const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
//   const open = Boolean(anchorEl);

//   const options: Option[] = [
//     { id: 1, text: "Email" },
//     { id: 2, text: "Employee Portal" },
//     { id: 3, text: "HR Management" },
//     { id: 4, text: "Project Management Tools" },
//     { id: 5, text: "Other" },
//   ];

//   const location = useLocation();
//   const initialPrompt =
//     (location.state as { initialPrompt?: string })?.initialPrompt || "";

//   useEffect(() => {
//     setSessionId(uuidv4());
//   }, []);

//   useEffect(() => {
//     if (sessionId && !hasSentInitialMessage.current) {
//       handleMessageSend(initialPrompt, false);
//       hasSentInitialMessage.current = true;
//     }
//   }, [sessionId, initialPrompt]);

//   useEffect(() => {
//     endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   useEffect(() => {
//     if (isVerificationCompleted && !hasSentVerificationMessage) {
//       handleMessageSend("User verified successfully.");
//       setHasSentVerificationMessage(true);
//     }
//   }, [isVerificationCompleted, hasSentVerificationMessage]);

//   const handleAuthComplete = () => {
//     setShowFacialAuth(false);
//     setIsVerificationCompleted(true);
//   };

//   const handleAuthClose = () => {
//     setShowFacialAuth(false);
//   };

//   const getCurrentTime = (): string => {
//     const now = new Date();
//     const timeString = now.toLocaleTimeString([], {
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//     console.log(`Generated Time: ${timeString}`);
//     return timeString;
//   };

//   const createMessage = (text: string, isUserMessage: boolean): Message => {
//     const message: Message = {
//       text,
//       isUserMessage,
//       timestamp: getCurrentTime(),
//     };
//     console.log(`Message Created:`, message);
//     return message;
//   };

//   const ChatComponent: React.FC = () => {
//     const [messages, setMessages] = React.useState<Message[]>([]);

//     const handleMessageSend = (text: string) => {
//       const newMessage = createMessage(text, true);
//       setMessages((prevMessages) => {
//         const updatedMessages = [...prevMessages, newMessage];
//         console.log("Updated Messages State:", updatedMessages);
//         return updatedMessages;
//       });
//     };

//     return (
//       <div>
//         {messages.map((message, index) => (
//           <ChatMessage key={index} message={message} />
//         ))}
//         <button onClick={() => handleMessageSend("Hello!")}>
//           Send Message
//         </button>
//       </div>
//     );
//   };

//   const ChatMessage: React.FC<{ message: Message }> = ({ message }) => {
//     const userName = localStorage.getItem("username");
//     const profilePhoto = localStorage.getItem("profilePhoto");
//     const fullName = localStorage.getItem("fullName");

//     return (
//       <div className="flex mb-5">
//         <div
//           className={`flex items-start w-full ${
//             message.isUserMessage ? "flex-row-reverse" : ""
//           }`}
//         >
//           <img
//             src={message.isUserMessage ? profilePhoto || Profile : ChatLogo}
//             alt={
//               message.isUserMessage
//                 ? fullName || userName || "User"
//                 : "BART Genie"
//             }
//             className="w-8 h-8 rounded-full mr-5 flex-shrink-0"
//           />
//           <div className="flex-1">
//             <div className="flex items-center">
//               {message.isUserMessage ? (
//                 <span className="font-bold">
//                   {fullName || userName || localStorage.getItem("username")}
//                 </span>
//               ) : (
//                 <span className="font-bold">BART Genie</span>
//               )}
//               <span className="w-1 h-1 bg-white rounded-full mx-1"></span>
//               <span className="text-sm text-gray-400">
//                 {message.timestamp || " "}
//               </span>
//             </div>
//             <div className="flex gap-2">
//               {(message.showOptions ||
//                 message.showOTP ||
//                 message.showVideoVerification ||
//                 message.ticketInfo) && (
//                 <div className="w-2 rounded-lg bg-gradient-to-b from-purple-600 to-pink-400"></div>
//               )}
//               <div>
//                 <div className="mt-2">{message.text}</div>
//                 {message.showOptions && (
//                   <div className="flex flex-wrap gap-2 mt-2">
//                     {options.map((option) => (
//                       <OptionCard
//                         key={option.id}
//                         option={option}
//                         onClick={() => handleMessageSend(option.text)}
//                       />
//                     ))}
//                   </div>
//                 )}
//                 {message.showOTP && (
//                   <OTPInputCard
//                     otp={otp}
//                     setOtp={setOtp}
//                     onSubmitOTP={(displayText: string) =>
//                       setMessages((prevMessages) => [
//                         ...prevMessages,
//                         createMessage(displayText, true),
//                       ])
//                     }
//                   />
//                 )}
//                 {message.showVideoVerification &&
//                   message.videoVerificationCard && (
//                     <VideoVerificationCard
//                       link={message.link || ""}
//                       onVerificationComplete={handleAuthComplete}
//                     />
//                   )}
//                 {message.ticketInfo && message.ticketInfo.showTicket && (
//                   <TicketCard
//                     ticketNo={message.ticketInfo.ticketNo}
//                     link={message.ticketInfo.link}
//                     assignedTo={message.ticketInfo.assignedTo}
//                     time={message.ticketInfo.time}
//                   />
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const OptionCard: React.FC<{ option: Option; onClick: () => void }> = ({
//     option,
//     onClick,
//   }) => (
//     <button
//       className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
//       onClick={onClick}
//     >
//       {option.text}
//     </button>
//   );

//   const OTPInputCard: React.FC<{
//     onSubmitOTP: (displayText: string) => void;
//     otp: string[];
//     setOtp: React.Dispatch<React.SetStateAction<string[]>>;
//   }> = ({ onSubmitOTP, otp, setOtp }) => {
//     const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

//     useEffect(() => {
//       if (inputRefs.current[0]) {
//         inputRefs.current[0].focus();
//       }
//     }, []);

//     useEffect(() => {
//       const firstEmptyIndex = otp.findIndex((value) => value === "");
//       if (firstEmptyIndex >= 0 && inputRefs.current[firstEmptyIndex]) {
//         inputRefs.current[firstEmptyIndex]?.focus();
//       }
//     }, [otp]);

//     const handleChange = (index: number, value: string) => {
//       const newOtp = otp.slice();
//       newOtp[index] = value.slice(-1);
//       setOtp(newOtp);

//       if (value && index < otp.length - 1) {
//         inputRefs.current[index + 1]?.focus();
//       }
//     };

//     const handleSubmit = () => {
//       handleMessageSend(otp.join(""), true);
//     };

//     return (
//       <div className="bg-gray-800 rounded-xl p-5 mt-4 max-w-md mx-auto text-center">
//         <div className="text-lg font-bold mb-4">Please enter OTP below</div>
//         <div className="flex justify-between mb-4">
//           {otp.map((value, index) => (
//             <input
//               key={index}
//               type="text"
//               value={value}
//               onChange={(e) => handleChange(index, e.target.value)}
//               onFocus={(e) => e.target.select()}
//               maxLength={1}
//               ref={(el) => (inputRefs.current[index] = el)}
//               className="w-10 h-10 text-center bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
//             />
//           ))}
//         </div>
//         <button
//           className="bg-gradient-to-r from-pink-400 to-purple-600 text-white font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity"
//           onClick={handleSubmit}
//         >
//           Submit
//         </button>
//       </div>
//     );
//   };

//   const TicketCard: React.FC<{
//     ticketNo: string;
//     link: string;
//     assignedTo: string;
//     time: string;
//     urgency?: string;
//   }> = ({ ticketNo, link, assignedTo, time, urgency }) => {
//     const date = new Date();
//     const day = String(date.getDate()).padStart(2, "0");
//     const monthIndex = date.getMonth();
//     const monthNames = [
//       "Jan",
//       "Feb",
//       "Mar",
//       "Apr",
//       "May",
//       "Jun",
//       "Jul",
//       "Aug",
//       "Sep",
//       "Oct",
//       "Nov",
//       "Dec",
//     ];
//     const monthName = monthNames[monthIndex];
//     const formattedTime = `${monthName} ${day}, ${date
//       .toLocaleString("en-US", {
//         hour: "numeric",
//         minute: "numeric",
//         hour12: true,
//       })
//       .replace(" ", "")}`;

//     console.log(formattedTime);

//     return (
//       <div
//         className="bg-gray-800 rounded-xl p-4 mb-4 shadow-lg hover:shadow-xl transition-shadow cursor-pointer w-full max-w-sm"
//         onClick={() => window.open(link, "_blank")}
//       >
//         <div className="mb-2">
//           <div className="flex justify-between items-center text-sm text-gray-400">
//             {urgency && <span className="text-red-500">• {urgency}</span>}
//             <span>
//               {formattedTime}{" "}
//               <span className="ml-2 text-red-500">• Urgent</span>
//             </span>
//           </div>
//           <div className="text-lg font-semibold mt-1">
//             <span>{assignedTo} || Password Recovery</span>
//           </div>
//         </div>
//         <div className="flex justify-between items-center">
//           <div>
//             <div className="text-sm text-gray-400">Ticket No.</div>
//             <div className="font-medium">{ticketNo}</div>
//           </div>
//           <div>
//             <div className="text-sm text-gray-400">Assigned to</div>
//             <div className="flex items-center">
//               <img
//                 src={ChatLogo}
//                 alt="Profile"
//                 className="w-6 h-6 rounded-full mr-2"
//               />
//               <span>{assignedTo}</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const DotLoader: React.FC = () => (
//     <div className="flex justify-between w-8">
//       <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"></div>
//       <div
//         className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"
//         style={{ animationDelay: "0.1s" }}
//       ></div>
//       <div
//         className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"
//         style={{ animationDelay: "0.2s" }}
//       ></div>
//     </div>
//   );

//   const handleAttachFile = () => {
//     // Implement file attachment logic here
//   };

//   const typingEffect = (
//     messageText: string,
//     delay: number = 50
//   ): Promise<void> => {
//     return new Promise((resolve) => {
//       let currentIndex = 0;
//       let interval = setInterval(() => {
//         if (currentIndex < messageText.length) {
//           setMessages((prevMessages) => {
//             const newMessages = prevMessages.slice(0, -1);
//             newMessages.push({
//               text: messageText.substring(0, currentIndex + 1),
//               isUserMessage: false,
//               isLoading: true,
//               timestamp: getCurrentTime(),
//             });
//             return newMessages;
//           });
//           currentIndex++;
//         } else {
//           clearInterval(interval);
//           resolve();
//         }
//       }, delay);
//     });
//   };

//   const storeMessage = async (
//     message: string,
//     isUserMessage: boolean
//   ): Promise<void> => {
//     try {
//       const username = localStorage.getItem("username");
//       const password = localStorage.getItem("password");

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

//   const VideoVerificationCard: React.FC<{
//     link: string;
//     onVerificationComplete: () => void;
//   }> = ({ link, onVerificationComplete }) => (
//     <button
//       className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition-colors"
//       onClick={() => {
//         setFacialAuthLink(link);
//         setShowFacialAuth(true);
//       }}
//     >
//       Face Recognition
//     </button>
//   );

//   const handleMessageSend = async (
//     input: string,
//     displayMessage: boolean = true,
//     actualOTP: string | null = null
//   ): Promise<void> => {
//     const initialMessage = "Hey BARTGenie, I want to raise a Jira Ticket";

//     if (!initialPromptProcessed) {
//       setIsLoading(true);

//       setMessages((prevMessages) => [
//         ...prevMessages,
//         createMessage(initialMessage, true),
//         {
//           text: <DotLoader />,
//           isUserMessage: false,
//           isLoading: true,
//           timestamp: getCurrentTime(),
//         },
//       ]);

//       try {
//         const client = new BedrockAgentRuntimeClient({
//           region: "us-east-1",
//           credentials: {
//             accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID || "",
//             secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY || "",
//           },
//         });

//         const command = new InvokeAgentCommand({
//           agentId: "U3YHVQFHVA",
//           agentAliasId: "FS3BRWFZ15",
//           sessionId: sessionId,
//           inputText: initialMessage,
//         });

//         const response = await client.send(command);
//         console.log("API Response:", response);

//         let fullResponse = "";
//         const decoder = new TextDecoder("utf-8");

//         if (response.completion) {
//           for await (const event of response.completion) {
//             if (event.chunk && event.chunk.bytes) {
//               const byteArray = new Uint8Array(event.chunk.bytes);
//               fullResponse += decoder.decode(byteArray, { stream: true });
//             }
//           }

//           await typingEffect(fullResponse);
//           await processAndDisplayResponse(fullResponse, true);
//           setInitialPromptProcessed(true);
//         } else {
//           console.error("Unexpected API response structure:", response);
//         }
//       } catch (error) {
//         console.error("Error:", error);
//       } finally {
//         setIsLoading(false);
//       }
//       return;
//     }

//     if (!displayMessage) {
//       if (initialPromptProcessed) {
//         return;
//       }

//       setIsLoading(true);
//       try {
//         const client = new BedrockAgentRuntimeClient({
//           region: "us-east-1",
//           credentials: {
//             accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID || "",
//             secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY || "",
//           },
//         });

//         const command = new InvokeAgentCommand({
//           agentId: "U3YHVQFHVA",
//           agentAliasId: "FS3BRWFZ15",
//           sessionId: sessionId,
//           inputText: input,
//         });

//         const response = await client.send(command);
//         console.log("API Response:", response);

//         let fullResponse = "";
//         const decoder = new TextDecoder("utf-8");

//         if (response.completion) {
//           for await (const event of response.completion) {
//             if (event.chunk && event.chunk.bytes) {
//               const byteArray = new Uint8Array(event.chunk.bytes);
//               fullResponse += decoder.decode(byteArray, { stream: true });
//             }
//           }

//           await typingEffect(fullResponse);
//           await processAndDisplayResponse(fullResponse, true);
//           setInitialPromptProcessed(true);
//         } else {
//           console.error("Unexpected API response structure:", response);
//         }
//       } catch (error) {
//         console.error("Error:", error);
//       } finally {
//         setIsLoading(false);
//       }
//       return;
//     }

//     if (input === "User verified successfully." && hasSentVerificationMessage) {
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const newMessage = {
//         text: actualOTP ? "Done!" : input,
//         isUserMessage: true,
//         timestamp: getCurrentTime(),
//       };
//       setMessages((prevMessages) => [
//         ...prevMessages,
//         newMessage,
//         {
//           text: <DotLoader />,
//           isUserMessage: false,
//           isLoading: true,
//           timestamp: getCurrentTime(),
//         },
//       ]);
//       await storeMessage(input, true);

//       const client = new BedrockAgentRuntimeClient({
//         region: "us-east-1",
//         credentials: {
//           accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID || "",
//           secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY || "",
//         },
//       });

//       const command = new InvokeAgentCommand({
//         agentId: "U3YHVQFHVA",
//         agentAliasId: "FS3BRWFZ15",
//         sessionId: sessionId,
//         inputText: actualOTP ? input : newMessage.text,
//       });

//       const response = await client.send(command);
//       console.log("API Response:", response);

//       let fullResponse = "";
//       const decoder = new TextDecoder("utf-8");

//       if (response.completion) {
//         for await (const event of response.completion) {
//           if (event.chunk && event.chunk.bytes) {
//             try {
//               const byteArray = new Uint8Array(event.chunk.bytes);
//               const decodedString = decoder.decode(byteArray, { stream: true });
//               fullResponse += decodedString;
//             } catch (decodeError) {
//               console.error("Error decoding chunk:", decodeError);
//             }
//           }
//         }

//         await typingEffect(fullResponse);
//         await processAndDisplayResponse(fullResponse, true);
//       } else {
//         console.error("Unexpected API response structure:", response);
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       const errorMessage = "An error occurred while fetching the response.";

//       setMessages((prevMessages) => {
//         const newMessages = prevMessages.slice(0, -1);
//         newMessages.push({
//           text: errorMessage,
//           isUserMessage: false,
//           timestamp: getCurrentTime(),
//         });
//         return newMessages;
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const processAndDisplayResponse = async (
//     fullResponse: string,
//     displayMessage: boolean
//   ): Promise<void> => {
//     console.log(
//       "processAndDisplayResponse called with:",
//       fullResponse,
//       displayMessage
//     );

//     const isOptionMessage =
//       fullResponse.includes("application") ||
//       fullResponse.includes("Application");
//     const isOTPMessage =
//       fullResponse.includes("enter the OTP") ||
//       fullResponse.includes("invalid") ||
//       fullResponse.includes("expired");
//     const isTicketMessage = fullResponse.includes(
//       "The Jira ticket was created successfully!"
//     );
//     const isVideoVerificationMessage =
//       fullResponse.includes("video verification");
//     const videoVerificationLink = isVideoVerificationMessage
//       ? fullResponse.match(/https:\/\/\S+/)?.[0]?.split(" ")[0]
//       : null;

//     setMessages((prevMessages) => {
//       if (!displayMessage) {
//         return prevMessages;
//       }

//       const newMessages = [...prevMessages.slice(0, -1)];

//       const responseMessage: Message = {
//         ...createMessage(fullResponse, false),
//         showOptions: isOptionMessage,
//         showOTP: isOTPMessage,
//         showVideoVerification: isVideoVerificationMessage,
//         link: videoVerificationLink || undefined,
//         videoVerificationCard: null,
//         ticketInfo: null,
//       };

//       if (isVideoVerificationMessage && !hasShownVideoVerification) {
//         responseMessage.videoVerificationCard = (
//           <div>
//             <VideoVerificationCard
//               link={videoVerificationLink || ""}
//               onVerificationComplete={handleAuthComplete}
//             />
//           </div>
//         );
//         setHasShownVideoVerification(true);
//       }

//       if (isTicketMessage) {
//         const linkMatch = fullResponse.match(/https:\/\/\S+/);
//         const link = linkMatch ? linkMatch[0].split(" ")[0] : "";
//         const assignedToMatch = fullResponse.match(/https:\/\/([^\.\n]+)/);
//         const ticketNoMatch = link.match(/([A-Z]+-\d+)/);
//         const assignedTo = assignedToMatch
//           ? assignedToMatch[1].trim()
//           : "Unknown";
//         const ticketNo = ticketNoMatch ? ticketNoMatch[1] : "Unknown";
//         const now = new Date();
//         const time =
//           now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) +
//           ", " +
//           now.toLocaleDateString();

//         responseMessage.ticketInfo = {
//           showTicket: true,
//           assignedTo,
//           ticketNo,
//           link,
//           time,
//         };
//       }

//       newMessages.push(responseMessage);

//       return newMessages;
//     });

//     setShowOTP(isOTPMessage);

//     if (displayMessage) {
//       await storeMessage(fullResponse, false);
//     }
//   };

//   const ChatInput: React.FC<{
//     onSend: (input: string) => void;
//     isLoading: boolean;
//     isOTPActive: boolean;
//   }> = ({ onSend, isLoading, isOTPActive }) => {
//     const [input, setInput] = useState<string>("");

//     const handleSubmit = (e: React.FormEvent) => {
//       e.preventDefault();
//       if (!isLoading && input.trim()) {
//         onSend(input);
//         setInput("");
//       }
//     };

//     const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//       if (e.key === "Enter") {
//         e.preventDefault();
//         handleSubmit(e);
//       }
//     };

//     return (
//       <div className="flex items-center bg-gray-800 rounded-full p-2 mt-4">
//         <img src={Icon7} alt="Icon 7" className="w-6 h-6 mr-2" />
//         <input
//           type="text"
//           placeholder="Ask BART Genie"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={handleKeyDown}
//           className="flex-1 bg-transparent text-white focus:outline-none"
//         />
//         <img
//           src={Icon8}
//           alt="Icon 8"
//           onClick={() => onSend(input)}
//           className="w-6 h-6 ml-2 cursor-pointer"
//         />
//       </div>
//     );
//   };

//   return (
//     <div className="flex h-screen bg-black">
//       <LeftPanel />
//       <main className="flex-1 p-4">
//         <div className="bg-gradient-to-r from-gray-900 to-indigo-900 rounded-3xl p-6 h-full overflow-auto">
//           <div className="flex items-center justify-between mb-6">
//             <div className="flex items-center">
//               <img
//                 src={JT}
//                 className="mr-2 border-r border-b border-gray-600 rounded"
//               />
//               <h2 className="font-sans text-lg text-gray-400 p-2">
//                 Raise a Ticket
//               </h2>
//             </div>
//             <div className="relative">
//               <Button
//                 id="basic-button"
//                 aria-controls={open ? "basic-menu" : undefined}
//                 aria-haspopup="true"
//                 aria-expanded={open ? "true" : undefined}
//                 onClick={(event: React.MouseEvent<HTMLButtonElement>) =>
//                   setAnchorEl(event.currentTarget)
//                 }
//               >
//                 <img src={LogoutIcon} alt="Logout" />
//               </Button>
//               <Menu
//                 id="basic-menu"
//                 anchorEl={anchorEl}
//                 open={open}
//                 onClose={() => setAnchorEl(null)}
//                 MenuListProps={{
//                   "aria-labelledby": "basic-button",
//                 }}
//               >
//                 <MenuItem onClick={() => navigate("/login")}>Logout</MenuItem>
//               </Menu>
//             </div>
//           </div>
//           <div className="pb-20 text-white overflow-auto">
//             {messages.map((message, index) => (
//               <ChatMessage key={index} message={message} />
//             ))}
//             <ChatInput
//               onSend={handleMessageSend}
//               isLoading={isLoading}
//               isOTPActive={showOTP}
//             />
//             {showFacialAuth && (
//               <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
//                 <FacialAuthComponent
//                   link={facialAuthLink}
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

// export default Agent;
