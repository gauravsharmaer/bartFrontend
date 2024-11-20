import LoginCard from "./loginCard";
import VideoCard from "../../components/videoCard";
import { AuthBackground } from "../../components/ui/authBackground";

const Login = () => {
  return (
    <AuthBackground>
      <div className="grid grid-cols-2 gap-x-1">
        <VideoCard />

        <LoginCard />
      </div>
    </AuthBackground>
  );
};

export default Login;
