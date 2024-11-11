import SignupCard from "./signupCard";
import VideoCard from "../../components/videoCard";
import { AuthBackground } from "../../components/ui/authBackground";
const Signup = () => {
  return (
    <AuthBackground>
      <div className="grid grid-cols-2 gap-x-1">
        <VideoCard />

        <SignupCard />
      </div>
    </AuthBackground>
  );
};

export default Signup;
