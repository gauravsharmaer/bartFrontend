import { useEffect, useState } from "react";
import { askBart } from "./api";
import ChatMessage from "./ChatMessage";
import DotLoader from "../passwordResetAgent/DotLoader";
import ChatLogo from "../../assets/Genie.svg";
import PlusIcon from "../../assets/plus-circle.svg";
import IconArrow from "../../assets/arrow-circle-up.svg";

interface Message {
  text: string;
  isUserMessage: boolean;
  timestamp: string;
  button_display: boolean;
  number_of_buttons: number;
  button_text: string[];
}

const PasswordResetUi = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [chatId, setChatId] = useState<string | null>(null);
  console.log(localStorage.getItem("chat_id"));
  // Initial API call when page loads
  useEffect(() => {
    const initialMessage = "Hey bart reset my password";

    // Start loading
    setLoading(true);

    // Make API call
    askBart({
      question: initialMessage,
      user_id: localStorage.getItem("user_id") || "",
    })
      .then((result) => {
        console.log("API Response:", result);

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
        console.error("API Error:", error);

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
  }, []); // Empty dependency array means this runs once on mount

  // Handle user input submissions
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

      console.log("API Response:", result);
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
      console.error("API Error:", error);

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
    <div className="flex flex-col h-[80vh] relative">
      <div className="w-[85%] h-full overflow-y-auto p-4  ">
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
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-[80%] absolute bottom-16 left-1/2 -translate-x-1/2"
      >
        <div className="flex items-center w-[100%] justify-center">
          <div className="flex items-center relative left-10">
            <div>
              <img
                src={PlusIcon}
                alt="PlusIcon"
                className="relative cursor-pointer h-5 w-5"
              />
            </div>
            <div className="h-1 w-1 rounded-full relative bottom-2 bg-green-500"></div>
          </div>
          <input
            type="text"
            placeholder="Ask BART Genie"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="w-[80%] flex bg-gray-800 p-2.5 rounded-full border border-[#3E3E3E] outline-none text-[#FFFFFF] px-12"
          />
          <button
            type="submit"
            disabled={loading}
            className="border-none bg-transparent p-0"
          >
            <img
              src={IconArrow}
              alt="IconArrow"
              className="relative right-11 cursor-pointer h-9 w-9"
            />
          </button>
        </div>
      </form>
    </div>
  );
};

export default PasswordResetUi;
