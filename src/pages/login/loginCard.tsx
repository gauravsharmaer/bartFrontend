import { useState } from "react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import avatar from "../../assets/Genie.svg";
import AuthSwitcher from "../../components/AuthSwitcher";
import usePasswordToggle from "../../hooks/usePasswordToggle";
const LoginCard = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleLogin = () => {
    console.log(email, password);
  };
  const { InputType, Icon } = usePasswordToggle();
  return (
    <div className="flex  justify-center items-center ">
      <div className="flex flex-col gap-4">
        {/* Logo/Avatar and Signup Heading */}
        <div className="flex flex-col justify-center items-center mb-4">
          <img
            src={avatar}
            alt="avatar"
            className="w-[50px] h-[50px] rounded-full"
          />

          <h2
            className="text-white text-2xl mt-2"
            style={{ fontFamily: "Times New Roman" }}
          >
            Login
          </h2>
        </div>

        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          type={InputType}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={Icon}
        />

        <Button className="mt-1" onClick={handleLogin}>
          Next
        </Button>

        <AuthSwitcher
          text="Don't have an account?"
          href="/signup"
          page="Signup"
        />
      </div>
    </div>
  );
};

export default LoginCard;
