interface Message {
  text: string;
  isUserMessage: boolean;
  timestamp: string;
  button_display: boolean;
  number_of_buttons: number;
  button_text: string[];
  showOtpInput?: boolean;
}

interface ChatMessageProps {
  message: Message;
  chatId: string;
  onNewMessage: (message: Message) => void;
}

interface InlineOTPCardProps {
  onSubmitOTP: (otp: string) => void;
  otp: string[];
  setOtp: React.Dispatch<React.SetStateAction<string[]>>;
}

interface chatMessage {
  id: string;
  question: string;
  answer: string;
}

export type { Message, ChatMessageProps, InlineOTPCardProps, chatMessage };
