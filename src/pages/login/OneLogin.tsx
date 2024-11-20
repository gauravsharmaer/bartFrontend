import React from "react";
import { initiateOneLogin } from "../../utils/authOneLogin";

const OneLogin: React.FC = () => {
  const handleLoginClick = () => {
    console.log("Button clicked, initiating OneLogin...");
    initiateOneLogin();
  };

  return (
    <div className="flex justify-center items-center">
      <button onClick={handleLoginClick} className="text-white">
        Login with OneLogin
      </button>
    </div>
  );
};

export default OneLogin;
