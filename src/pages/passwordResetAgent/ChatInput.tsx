import React, { useState, useCallback } from "react";
import Icon7 from "../../assets/plus-circle.svg";
import Icon8 from "../../assets/arrow-circle-up.svg";

interface ChatInputProps {
  onSend: (input: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = React.memo(
  ({ onSend, isLoading }) => {
    const [input, setInput] = useState<string>("");

    const handleSubmit = useCallback(
      (e: React.FormEvent) => {
        e.preventDefault();
        if (!isLoading && input.trim()) {
          onSend(input);
          setInput("");
        }
      },
      [isLoading, input, onSend]
    );

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          handleSubmit(e);
        }
      },
      [handleSubmit]
    );

    return (
      <div className="chat flex items-center bg-gray-800 rounded-lg p-2">
        <img src={Icon7} alt="Icon 7" className="w-6 h-6" />
        <textarea
          placeholder="Ask BART Genie"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          className="flex-1 mx-2 p-2 resize-none border-none bg-transparent text-white text-base overflow-y-scroll scrollbar-hide outline-none font-sans"
        />
        <img
          src={Icon8}
          alt="Icon 8"
          onClick={handleSubmit}
          className="template-icon1 w-6 h-6 cursor-pointer ml-2"
        />
      </div>
    );
  }
);

export default ChatInput;
