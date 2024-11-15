import { BART_API_URL } from "../../config";
interface APIError {
  message: string;
  status?: number;
}

interface AskRequest {
  question: string;
  user_id: string;
  chat_id?: string;
}

interface AskResponse {
  question: string;
  answer: string;
  chat_id: string;
  display_settings: {
    vertical_bar: boolean;
    button_display: boolean;
    options: {
      buttons: string[];
    };
    message_history: {
      question: string;
      answer: string;
    }[];
  };
}

interface VerifyOTPRequest {
  otp: number;
  email: string;
  chat_id: string;
}

interface VerifyOTPResponse {
  question: string;
  answer: string;
  chat_id: string;
  display_settings: {
    vertical_bar: boolean;
    button_display: boolean;
    options: {
      buttons: string[];
    };
    message_history: {
      question: string;
      answer: string;
    }[];
  };
}

const API_BASE_URL = BART_API_URL;

export const askBart = async (data: AskRequest): Promise<AskResponse> => {
  try {
    const requestBody = {
      question: data.question,
      user_id: data.user_id,
      ...(data.chat_id && { chat_id: data.chat_id }),
    };

    const response = await fetch(`${API_BASE_URL}/ask`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw {
        message: responseData.message || "Ask request failed",
        status: response.status,
      } as APIError;
    }

    return responseData as AskResponse;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error("Invalid response format from server");
    }

    if ((error as APIError).status) {
      const apiError = error as APIError;
      throw new Error(
        `Ask request failed (${apiError.status}): ${apiError.message}`
      );
    }

    throw new Error(
      "An unexpected error occurred while processing your question"
    );
  }
};

export const verifyOTP = async (
  data: VerifyOTPRequest
): Promise<AskResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/verification/verify_otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw {
        message: responseData.message || "Verification failed",
        status: response.status,
      } as APIError;
    }

    return responseData as VerifyOTPResponse;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error("Invalid response format from server");
    }

    if ((error as APIError).status) {
      const apiError = error as APIError;
      throw new Error(
        `OTP verification failed (${apiError.status}): ${apiError.message}`
      );
    }

    throw new Error("An unexpected error occurred during OTP verification");
  }
};

// Usage examples:
/*
// Ask Bot Example
try {
  const result = await askBart({
    question: "hey bart password reset",
    user_id: "67223759bc24b443f22dcd9b"
  });
  console.log('Response received:', result);
} catch (error) {
  console.error('Ask request failed:', error);
}

// Verify OTP Example
try {
  const result = await verifyOTP({
    otp: 123456,
    email: "user@example.com",
    chat_id: "chat123"
  });
  console.log('OTP verified:', result);
} catch (error) {
  console.error('Verification failed:', error);
}
*/
