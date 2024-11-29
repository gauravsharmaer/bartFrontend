import { LoginInterface } from "./Interface/Interface";
import { NODE_API_URL } from "../../config";
import { toast } from "react-toastify";
export const LoginApiService = {
  postLogin: async (
    email: string,
    password: string
  ): Promise<LoginInterface> => {
    try {
      const response = await fetch(`${NODE_API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const jsonResponse = await response.json();

      if (!response.ok) {
        toast.error(jsonResponse.message || "Login failed");
        throw new Error(jsonResponse.message || "Login failed");
      }

      return jsonResponse;
    } catch (error) {
      // Rethrow with more context if needed
      throw error instanceof Error
        ? error
        : new Error("An unexpected error occurred during signup");
    }
  },
};
