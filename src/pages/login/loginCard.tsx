import { useState } from "react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import avatar from "../../assets/Genie.svg";
import camera from "../../assets/camera.svg";
import AuthSwitcher from "../../components/AuthSwitcher";
import usePasswordToggle from "../../hooks/usePasswordToggle";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { userLogin } from "../../redux/authSlice";
// import { toast } from "react-toastify";
import { validateLoginSchema } from "../../utils/authValidate";
import AuthvideoCard from "./AuthvideoCard";
import Email from "../../assets/Email.svg";
import ForgotPasswordPopUp from "../../components/forgotPassword";

const LoginCard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [viaphoto, setViaphoto] = useState(false);
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [forgotPasswordPopup, setForgotPasswordPopup] = useState(false);

  const handleLogin = () => {
    const validationResponse = validateLoginSchema({ email, password });
    console.log(validationResponse);
    if (!validationResponse.success) {
      let newEmailError = null;
      let newPasswordError = null;

      validationResponse.error.issues.forEach((issue) => {
        if (issue.path[0] === "email") {
          newEmailError = issue.message;
        } else if (issue.path[0] === "password") {
          newPasswordError = issue.message;
        }
      });

      setEmailError(newEmailError);
      setPasswordError(newPasswordError);

      return;
    }
    // Clear any previous errors if validation succeeds
    setEmailError(null);
    setPasswordError(null);
    dispatch(userLogin({ email, password }));
  };

  const { InputType, Icon } = usePasswordToggle();
  return (
    <>
      <ForgotPasswordPopUp
        active={forgotPasswordPopup}
        closeForgetPasswordpage={() => setForgotPasswordPopup(false)}
      />
      <div className="flex  justify-center items-center ">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col justify-center items-center ">
            <img
              src={avatar}
              alt="avatar"
              className="w-12 h-12 rounded-full mb-7"
            />

            <h2 className="text-white text-2xl font-normal font-pockota">
              Login
            </h2>
          </div>

          {!viaphoto ? (
            <div className="flex items-center gap-2 text-sm font-normal justify-center mb-8">
              <span className="text-[#79716D] "> via email or</span>
              <img src={camera} alt="camera" className="w-4 h-4" />
              <span
                className="text-[#FFFFFF] cursor-pointer border-b border-dotted"
                onClick={() => setViaphoto(true)}
              >
                Photo Login
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm font-normal justify-center mb-8">
              <span className="text-[#79716D] "> via Photo login or</span>
              <img src={Email} alt="camera" className="w-4 h-4" />
              <span
                className="text-[#FFFFFF] cursor-pointer border-b border-dotted"
                onClick={() => setViaphoto(false)}
              >
                Email Login
              </span>
            </div>
          )}

          {viaphoto ? (
            <AuthvideoCard />
          ) : (
            <>
              <Input
                type="email"
                placeholder="Email or username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={emailError}
              />

              <Input
                error={passwordError}
                type={InputType}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={Icon}
              />

              <Button className="" onClick={handleLogin}>
                Enter
              </Button>

              <div
                className="text-[#69696C] font-normal text-sm cursor-pointer mb-1"
                onClick={() => setForgotPasswordPopup(true)}
              >
                Forgot Password?
              </div>
            </>
          )}
          <AuthSwitcher
            text="Don't have an account?"
            href="/signup"
            page="Signup"
          />
        </div>
      </div>
    </>
  );
};

export default LoginCard;
