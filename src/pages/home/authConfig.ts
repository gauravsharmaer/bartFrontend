/* eslint-disable @typescript-eslint/no-explicit-any */
import { NODE_API_URL } from "../../config";

export const AUTH_MODES = {
  capture: {
    apiEndpoint: `${NODE_API_URL}/update-face-descriptor`,
    successCheck: (result: any) =>
      result.message === "Face descriptor updated successfully",
    onSuccess: () => localStorage.setItem("isFaceVerified", "true"),
  },
  verify: {
    apiEndpoint: `${NODE_API_URL}/verify-user-face`,
    successCheck: (result: any) => result.isMatch,
    onSuccess: () => {},
  },
};
