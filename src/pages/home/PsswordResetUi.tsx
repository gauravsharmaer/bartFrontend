import { useEffect, useState, useRef } from "react";
import { askBart } from "./api";
import ChatMessage from "./ChatMessage";
import DotLoader from "../passwordResetAgent/DotLoader";
import ChatLogo from "../../assets/Genie.svg";
import PlusIcon from "../../assets/plus-circle.svg";
import IconArrow from "../../assets/arrow-circle-up.svg";
import { Message } from "../../interfaces/Interface";

const PasswordResetUi = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [chatId, setChatId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  console.log(messages);
  useEffect(() => {
    const initialMessage = "Hey bart reset my password";

    setLoading(true);

    askBart({
      question: initialMessage,
      user_id: localStorage.getItem("user_id") || "",
    })
      .then((result) => {
        const userMessage: Message = {
          text: initialMessage,
          isUserMessage: true,
          timestamp: new Date().toLocaleTimeString(),
          button_display: false,
          number_of_buttons: 0,
          button_text: [],
        };

        const botMessage: Message = {
          text: result.answer || "No response received",
          isUserMessage: false,
          timestamp: new Date().toLocaleTimeString(),
          button_display: result.display_settings?.button_display || false,
          number_of_buttons:
            result.display_settings?.options?.buttons?.length || 0,
          button_text: result.display_settings?.options?.buttons || [],
        };

        setMessages([userMessage, botMessage]);

        if (result.chat_id) {
          localStorage.setItem("chat_id", result.chat_id);
          setChatId(result.chat_id);
        }
      })
      .catch((error) => {
        const errorBotMessage: Message = {
          text: error instanceof Error ? error.message : "An error occurred",
          isUserMessage: false,
          timestamp: new Date().toLocaleTimeString(),
          button_display: false,
          number_of_buttons: 0,
          button_text: [],
        };

        setMessages((prev) => [...prev, errorBotMessage]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    // Auto-scroll to the latest message
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      text: inputMessage,
      isUserMessage: true,
      timestamp: new Date().toLocaleTimeString(),
      button_display: false,
      number_of_buttons: 0,
      button_text: [],
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setInputMessage("");

    try {
      const result = await askBart({
        question: inputMessage,
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

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorBotMessage: Message = {
        text: error instanceof Error ? error.message : "An error occurred",
        isUserMessage: false,
        timestamp: new Date().toLocaleTimeString(),
        button_display: false,
        number_of_buttons: 0,
        button_text: [],
      };

      setMessages((prev) => [...prev, errorBotMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleNewMessage = (message: Message) => {
    setMessages((prev) => [...prev, message]);
  };

  return (
    <div className="flex flex-col h-screen relative">
      <div
        className="w-full h-full overflow-y-auto p-4"
        style={{
          WebkitOverflowScrolling: "touch",
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >
        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            message={message}
            chatId={chatId || ""}
            onNewMessage={handleNewMessage}
          />
        ))}

        {loading && (
          <div className="flex items-start w-full">
            <div className="flex items-start w-full">
              <img
                src={ChatLogo}
                alt="BART Genie"
                className="w-8 h-8 rounded-full object-cover mr-2"
              />
              <div className="flex-1 text-left">
                <div className="flex items-center">
                  <span className="text-sm font-semibold mr-2">BART Genie</span>
                  <span className="w-1 h-1 bg-white rounded-full mx-1"></span>
                  <span className="text-xs text-gray-400">
                    {new Date().toLocaleTimeString()}
                  </span>
                </div>
                <div className="mt-2">
                  <DotLoader />
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="w-full p-4 pb-10">
        <div className="flex items-center justify-between w-full bg-[#2C2C2E] text-white px-4 py-2 rounded-full border border-gray-700">
          <img
            src={PlusIcon}
            alt="Plus Icon"
            className="cursor-pointer h-5 w-5"
          />
          <input
            type="text"
            placeholder="Ask BART Genie"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-1 bg-transparent outline-none text-white mx-4"
          />
          <button
            type="submit"
            disabled={loading}
            className="border-none bg-transparent p-0"
          >
            <img
              src={IconArrow}
              alt="Arrow Icon"
              className="cursor-pointer h-10 w-10"
            />
          </button>
        </div>
      </form>
    </div>
  );
};

export default PasswordResetUi;
