import { HistoryInterface, chatHistory } from "./Interface/interface";

export const HistoryApiService = {
  getHistory: async (chatId: string): Promise<HistoryInterface> => {
    try {
      const response = await fetch(
        `https://bart-api-bd05237bdea5.herokuapp.com/chat_histories/${chatId}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch chat history");
      }

      const jsonResponse = await response.json();
      return jsonResponse;
    } catch (error) {
      // Rethrow with more context if needed
      throw error instanceof Error
        ? error
        : new Error("An unexpected error occurred during signup");
    }
  },
  getUserChats: async (): Promise<chatHistory[]> => {
    try {
      const response = await fetch(
        `https://bart-api-bd05237bdea5.herokuapp.com/chats/${localStorage.getItem(
          "user_id"
        )}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch chat history");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error("An unexpected error occurred during signup");
    }
  },
};
