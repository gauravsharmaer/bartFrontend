// import React, { useCallback, useState } from "react";

// import PlusIcon from "../../assets/plus-circle.svg";
// import IconArrow from "../../assets/arrow-circle-up.svg";
// interface ChatInputProps {
//   onSend: (input: string) => void;
//   isLoading: boolean;
// }

// const ChatInput: React.FC<ChatInputProps> = ({ onSend, isLoading }) => {
//   const [input, setInput] = useState<string>("");

//   const handleSubmit = useCallback(
//     (e: React.FormEvent) => {
//       e.preventDefault();
//       if (!isLoading && input.trim()) {
//         onSend(input);
//         setInput("");
//       }
//     },
//     [isLoading, input, onSend]
//   );

//   const handleKeyDown = useCallback(
//     (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
//       if (e.key === "Enter" && !e.shiftKey) {
//         e.preventDefault();
//         handleSubmit(e);
//       }
//     },
//     [handleSubmit]
//   );

//   // const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
//   //   e.preventDefault();
//   //   if (!isLoading && input.trim()) {
//   //     onSend(input);
//   //     setInput("");
//   //   }
//   // };

//   return (
//     // <form onSubmit={handleSubmit}>
//     //   <input
//     //     type="text"
//     //     value={input}
//     //     onChange={(e) => setInput(e.target.value)}
//     //     placeholder="Ask BART Genie"
//     //     className="w-full bg-transparent text-white text-base p-2.5 rounded-full border border-gray-600 focus:outline-none"
//     //   />
//     //   <button
//     //     type="submit"
//     //     disabled={isLoading}
//     //     className="bg-gray-700 text-white px-5 py-2.5 rounded-full cursor-pointer transition-colors duration-300 hover:bg-gray-600 disabled:bg-gray-500 disabled:cursor-not-allowed"
//     //   >
//     //     Send
//     //   </button>
//     // </form>

//     <div className=" flex items-center fixed bottom-12  w-[74vw]   3xl:p-10 ">
//       <div className="flex items-center relative left-10">
//         <div>
//           <img
//             src={PlusIcon}
//             alt="PlusIcon"
//             // onClick={() => onSend(input)}
//             className="relative  cursor-pointer h-5 w-5" // Add margin-left for spacing
//           />
//         </div>
//         <div
//           className={`h-1 w-1 rounded-full relative bottom-2
//       bg-green-500
//     `}
//         ></div>
//       </div>
//       <textarea
//         placeholder="Ask BART Genie"
//         value={input}
//         onChange={(e) => setInput(e.target.value)}
//         onKeyDown={handleKeyDown}
//         rows={1}
//         className="
//       w-[80%] flex bg-gray-800 p-2.5 rounded-full border border-[#3E3E3E] outline-none text-[#FFFFFF] px-12"
//       />
//       <img
//         src={IconArrow}
//         alt="IconArrow"
//         onClick={handleSubmit}
//         className="relative right-11 cursor-pointer h-9 w-9" // Add margin-left for spacing
//       />
//       {/* <img
//       src={Icon8}
//       alt="Icon 8"
//       onClick={handleSubmit}
//       className="template-icon1 w-6 h-6 cursor-pointer ml-2"
//     /> */}
//     </div>
//   );
// };

// export default ChatInput;
