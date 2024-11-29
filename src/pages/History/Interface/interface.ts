interface ChatMessageProps {
  message: chatMessage;
}

interface chatMessage {
  id: string;
  question: string;
  answer: string;
}
interface chatHistory {
  id: string;
  name: string;
  user_id: string;
}

type HistoryInterface = chatMessage[];

export type { ChatMessageProps, HistoryInterface, chatMessage, chatHistory };
