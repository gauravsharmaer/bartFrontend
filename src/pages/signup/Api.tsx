import { SignUpInterface } from "./Interface/interface";
import { NODE_API_URL } from "../../config";

export const SignUpApiService = {
  postSignUp: async (
    name: string,
    email: string,
    password: string,
    confirmPassword: string,
    phoneNumber: string,
    faceDescriptor: Float32Array
  ): Promise<SignUpInterface> => {
    try {
      const response = await fetch(`${NODE_API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          confirmPassword,
          phoneNumber,
          faceDescriptor: Array.from(faceDescriptor),
        }),
      });

      const jsonResponse = await response.json();

      if (!response.ok) {
        throw new Error(jsonResponse.message || "Signup failed");
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
