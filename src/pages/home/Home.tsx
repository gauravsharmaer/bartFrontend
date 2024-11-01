// import { HomeBackground } from "../../components/ui/homeBackground";
import Card from "../../components/ui/card";
import laptopIcon from "../../assets/laptop.svg";
import passwordIcon from "../../assets/password.svg";
import compuerIcon from "../../assets/computer-settings.svg";
import { useState } from "react";
import wifiIcon from "../../assets/wifi.svg";
import lightningIcon from "../../assets/lightning.svg";
// import PasswordResetAgent from "../passwordResetAgent/PasswordResetAgent";
import Navbar from "../../components/Navbar";
// import KnowledgeBase from "../knowledgeBase/KnowledgeBase";
import PlusIcon from "../../assets/plus-circle.svg";
import IconArrow from "../../assets/arrow-circle-up.svg";
const Home = () => {
  const [passwordResetAgent, setPasswordResetAgent] = useState(false);
  return (
    <div
      className="flex justify-center items-center h-screen
    bg-cover bg-center w-screen absolute top-0 left-0 bg-[#080808] flex-col"
    >
      <div className="flex justify-between w-[100%] flex-row">
        <div className="flex h-screen   ">
          <Navbar />
        </div>

        <div className=" w-full justify-center items-center flex flex-col ">
          <div
            className="bg-[url('/homeBackground.svg')]  bg-cover bg-center w-[90%]  h-[95%] 5xl:max-h-[96%]
           justify-center items-center flex rounded-xl flex-col px-10"
          >
            {!passwordResetAgent ? (
              <div>
                <div className="flex flex-col gap-3">
                  <div className="flex flex-row gap-2 items-center mb-4 justify-center">
                    <img
                      src={lightningIcon}
                      alt="lightning"
                      className="w-4 h-4"
                    />
                    <div className="text-[16px] font-normal text-[#FFFFFF] opacity-40">
                      Suggested templates
                    </div>
                  </div>

                  <div className="flex flex-col  gap-3 w-[60%] h-[400px] flex-wrap  ">
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
                </div>
              </div>
            ) : (
              // <PasswordResetAgent />
              // <KnowledgeBase />
              <p>Hello</p>
            )}

            {!passwordResetAgent && (
              <div className="  w-[80%] flex justify-center items-center absolute bottom-16 ">
                <div className="flex items-center  w-[100%] justify-center">
                  <div className="flex items-center relative left-10">
                    <div>
                      <img
                        src={PlusIcon}
                        alt="PlusIcon"
                        // onClick={() => onSend(input)}
                        className="relative  cursor-pointer h-5 w-5" // Add margin-left for spacing
                      />
                    </div>
                    <div
                      className={`h-1 w-1 rounded-full relative bottom-2
          bg-green-500
         `}
                    ></div>
                  </div>
                  <input
                    type="text"
                    placeholder="Ask BART Genie"
                    // value={input}
                    // onChange={e => setInput(e.target.value)}
                    // onKeyDown={handleKeyDown}
                    className="w-[80%] flex bg-gray-800 p-2.5 rounded-full border border-[#3E3E3E] outline-none text-[#FFFFFF] px-12"
                  />

                  <img
                    src={IconArrow}
                    alt="IconArrow"
                    // onClick={() => onSend(input)}
                    className="relative right-11 cursor-pointer h-9 w-9" // Add margin-left for spacing
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
