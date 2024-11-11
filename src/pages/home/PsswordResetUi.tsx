import { useEffect, useState } from "react";
import { askBart } from "./api";
import ChatMessage from "./ChatMessage";
import DotLoader from "../passwordResetAgent/DotLoader";
import ChatLogo from "../../assets/Genie.svg";

const PasswordResetUi = () => {
  const [messages, setMessages] = useState<
    Array<{
      text: string;
      isUserMessage: boolean;
      timestamp: string;
    }>
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const initializePasswordReset = async () => {
      if (!mounted) return;

      // Add user's initial message only if no messages exist
      if (messages.length === 0) {
        setMessages([
          {
            text: "Hey bart reset my password",
            isUserMessage: true,
            timestamp: new Date().toLocaleTimeString(),
          },
        ]);
      }

      try {
        const result = await askBart({
          question: "hey bart password reset",
          user_id: "67223759bc24b443f22dcd9b",
        });

        if (mounted) {
          // Add bot's response
          setMessages((prev) => [
            ...prev,
            {
              text: result.message,
              isUserMessage: false,
              timestamp: new Date().toLocaleTimeString(),
            },
          ]);
        }
      } catch (error) {
        if (mounted) {
          const errorMessage =
            error instanceof Error ? error.message : "An error occurred";
          console.error("API Error:", errorMessage);

          setMessages((prev) => [
            ...prev,
            {
              text: errorMessage,
              isUserMessage: false,
              timestamp: new Date().toLocaleTimeString(),
            },
          ]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializePasswordReset();

    // Cleanup function
    return () => {
      mounted = false;
    };
  }, []); // Empty dependency array

  return (
    <div className="flex flex-col gap-4 p-4 max-h-[80vh] overflow-y-auto">
      {messages.map((message, index) => (
        <ChatMessage key={index} message={message} />
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
  );
};

export default PasswordResetUi;
