import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API_URL } from "../../config";
import { AuthBackground } from "../../components/ui/authBackground";
import VideoCard from "../../components/videoCard";
import { Spinner } from "@phosphor-icons/react";
const OneLoginCallBack = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      // 1. Get parameters from URL
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code"); // Authentication code from OneLogin
      const state = params.get("state"); // State parameter for security
      console.log("state", state);
      // 2. Verify state (security check)
      const savedState = sessionStorage.getItem("auth_state");
      if (!code || !state || state !== savedState) {
        toast.error("Authentication failed");
        navigate("/login");
        return;
      }

      setLoading(true);

      try {
        // 3. Exchange code for tokens
        const response = await fetch(`${API_URL}/auth/onelogin/callback`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ code, state }),
        });

        if (!response.ok) {
          throw new Error("Authentication failed");
        }

        // 4. Handle successful response
        const data = await response.json();

        // 5. Store user data
        localStorage.setItem("email", JSON.stringify(data.email));
        localStorage.setItem("user_id", JSON.stringify(data.user_id));
        localStorage.setItem("name", JSON.stringify(data.name));

        // 6. Clean up
        sessionStorage.removeItem("auth_state");

        // 7. Notify and redirect
        toast.success("Successfully logged in");
        navigate("/"); // or your dashboard route
        setLoading(false);
      } catch (error) {
        // 8. Handle errors
        console.error("Authentication error:", error);
        toast.error("Authentication failed");
        navigate("/login");
        setLoading(false);
      }
    };

    handleCallback();
  }, [navigate]);

  // 9. Show loading state
  return (
    <AuthBackground>
      <div className="grid grid-cols-2 gap-x-1">
        <div className="flex justify-center items-center h-screen">
          <VideoCard />
        </div>

        <div className="flex justify-center items-center h-screen">
          {loading ? (
            <div className="text-purple-500 flex  items-center">
              <div className="animate-spin text-4xl">
                <Spinner />
              </div>
              <div className="">Authenticating...</div>
            </div>
          ) : null}
        </div>
      </div>
    </AuthBackground>
  );
};

export default OneLoginCallBack;
