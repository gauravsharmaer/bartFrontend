import React, { useState } from "react";
import { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom";
const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = "http://localhost:4000/api/users/reset-password";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: token, newPassword: newPassword }),
      });
      const jsonResponse = await response.json();

      if (!response.ok) {
        throw new Error(jsonResponse.message || "An error occurred");
      }

      toast.success(jsonResponse.message);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="garadientBG min-h-screen">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          Reset your password
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="new-password"
                className="block text-sm font-medium text-gray-700"
              >
                New Password
              </label>
              <div className="mt-1">
                <input
                  id="new-password"
                  name="new-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none block w-full px-3 py-2 border
                   border-gray-300 rounded-md shadow-sm
                    placeholder-gray-400 focus:outline-none
                     focus:ring-[#303030] focus:border-[#303030] sm:text-sm"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm New Password
              </label>
              <div className="mt-1">
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#303030] focus:border-[#303030] sm:text-sm"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#262626] hover:bg-[#303030] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Reset Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
