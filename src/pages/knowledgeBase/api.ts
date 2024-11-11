// import React from "react";
// import {
//   BedrockAgentRuntimeClient,
//   InvokeAgentCommand,
// } from "@aws-sdk/client-bedrock-agent-runtime";
// import {
//   REACT_APP_AWS_REGION,
//   REACT_APP_AWS_ACCESS_KEY_ID,
//   REACT_APP_AWS_SECRET_ACCESS_KEY,
// } from "../../config";
// import ChatInput from "./chatInput";

// interface Message {
//   text: string;
//   isUserMessage: boolean;
//   timestamp: string;
//   isLoading?: boolean;
// }

// interface HandleChatMessageProps {
//   sessionId: string;
//   messages: Message[];
//   setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
//   isLoading: boolean;
//   setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
//   initialPromptProcessed: boolean;
//   setInitialPromptProcessed: React.Dispatch<React.SetStateAction<boolean>>;
//   storeMessage: (message: string, isUserMessage: boolean) => Promise<void>;
// }

// const HandleChatMessage: React.FC<HandleChatMessageProps> = ({
//   sessionId,
//   messages,
//   setMessages,
//   isLoading,
//   setIsLoading,
//   initialPromptProcessed,
//   setInitialPromptProcessed,
//   storeMessage,
// }) => {
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

//       const command = new InvokeAgentCommand({
//         agentId: "U3YHVQFHVA",
//         agentAliasId: "FS3BRWFZ15",
//         sessionId: sessionId,
//         inputText: input,
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

//   return <ChatInput onSend={handleMessageSend} isLoading={isLoading} />;
// };

// export default HandleChatMessage;
