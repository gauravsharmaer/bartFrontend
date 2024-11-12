import Card from "../../components/ui/card";
import laptopIcon from "../../assets/laptop.svg";
import passwordIcon from "../../assets/password.svg";
import PasswordResetUi from "./PsswordResetUi";
import compuerIcon from "../../assets/computer-settings.svg";
import { useState } from "react";
import wifiIcon from "../../assets/wifi.svg";
import lightningIcon from "../../assets/Lightning.svg"
import cleaningIcon from "../../assets/cleaning-brush.svg";
import repairIcon from "../../assets/repair-tools.svg";
import PlusIcon from "../../assets/plus-circle.svg";
import IconArrow from "../../assets/arrow-circle-up.svg";

const Home = () => {
  const [passwordResetAgent, setPasswordResetAgent] = useState(false);
  return (


    <div className="w-full justify-center items-center h-screen flex flex-col p-4">
      <div
        className="garadientBG bg-cover bg-center justify-center w-full h-full items-center flex rounded-xl flex-col px-10"
      >
        {!passwordResetAgent ? (
          <div>
            <div className="flex flex-col gap-3 xl:pl-16">
              <div className="flex flex-row gap-2 items-center mb-12 justify-center">
                <img
                  src={lightningIcon}
                  alt="lightning"
                  className="w-4 h-4"
                />
                <div className="text-[16px] font-normal text-[#FFFFFF] opacity-40">
                  Suggested templates
                </div>
              </div>

              <div className="grid grid-rows-2 grid-cols-3  gap-4">
                <Card
                  title="Reset your application passwords with ease."
                  onClick={() => setPasswordResetAgent(true)}
                  icon={passwordIcon}
                />
                <Card
                  title="Setup,maintain and troubleshoot all your devices."
                  icon={repairIcon}
                />
                <Card
                  title="Seamlessly request and track new equipment approvals"
                  icon={laptopIcon}
                />
                <Card
                  title="Install software with guided instructions and ticket updates."
                  icon={compuerIcon}
                />
                <Card
                  title="Detect and fix WiFi issues with real-time support."
                  icon={wifiIcon}
                />
                <Card
                  title="Schedule equipment maintenence effortlessly"
                  icon={cleaningIcon}
                />
              </div>
            </div>
          </div>
        ) : (
          <PasswordResetUi />
        )}

        {!passwordResetAgent && (
          <div className="w-[80%] flex justify-center items-center absolute bottom-16">
            <div className="flex items-center w-[100%] justify-center">
              <div className="flex items-center relative left-10">
                <div>
                  <img
                    src={PlusIcon}
                    alt="PlusIcon"
                    className="relative cursor-pointer h-5 w-5"
                  />
                </div>
                <div
                  className="h-1 w-1 rounded-full relative bottom-2
                        bg-green-500"
                ></div>
              </div>
              <input
                type="text"
                placeholder="Ask BART Genie"
                className="w-[80%] flex bg-gray-800 p-2.5 rounded-full border border-[#3E3E3E] outline-none text-[#FFFFFF] px-12"
              />

              <img
                src={IconArrow}
                alt="IconArrow"
                className="relative right-11 cursor-pointer h-9 w-9"
              />
            </div>
          </div>
        )}
      </div>
    </div>

  );
};

export default Home;
