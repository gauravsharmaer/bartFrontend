import { HomeBackground } from "../../components/ui/homeBackground";
import Card from "../../components/ui/card";
import laptopIcon from "../../assets/laptop.svg";
import passwordIcon from "../../assets/password.svg";
import compuerIcon from "../../assets/computer-settings.svg";
import { useState } from "react";
import wifiIcon from "../../assets/wifi.svg";
import lightningIcon from "../../assets/lightning.svg";
import PasswordResetAgent from "../passwordResetAgent/PasswordResetAgent";
import Navbar from "../../components/Navbar";
const Home = () => {
  const [passwordResetAgent, setPasswordResetAgent] = useState(false);
  return (
    <div
      className="flex justify-center items-center h-screen
    bg-cover bg-center w-screen absolute top-0 left-0 bg-[#080808] "
    >
      <div className="flex justify-between w-[100%]">
        <div className="flex h-screen   ">
          <Navbar />
        </div>

        <div className=" w-full justify-center items-center flex ">
          <div className="bg-[url('/homeBackground.svg')]  bg-cover bg-center w-[95%] h-[95%] justify-center items-center flex rounded-xl">
            {!passwordResetAgent ? (
              <>
                <div className="flex flex-col  gap-3 w-[750px] h-[400px] flex-wrap mx-auto">
                  <Card
                    title="Seamlessly request and track new equipment approvals"
                    onClick={() => setPasswordResetAgent(true)}
                    icon={laptopIcon}
                  />
                  <Card
                    title="Seamlessly request and track new equipment approvals"
                    icon={passwordIcon}
                  />
                  <Card
                    title="Seamlessly request and track new equipment approvals"
                    icon={laptopIcon}
                  />
                  <Card
                    title="Seamlessly request and track new equipment approvals"
                    icon={compuerIcon}
                  />
                  <Card
                    title="Seamlessly request and track new equipment approvals"
                    icon={wifiIcon}
                  />
                  <Card
                    title="Seamlessly request and track new equipment approvals"
                    icon={laptopIcon}
                  />
                </div>
              </>
            ) : (
              <PasswordResetAgent />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
