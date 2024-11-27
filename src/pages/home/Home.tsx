import Card from "../../components/ui/card";
import laptopIcon from "../../assets/laptop.svg";
import passwordIcon from "../../assets/password.svg";
import PasswordResetUi from "./PsswordResetUi";
import compuerIcon from "../../assets/computer-settings.svg";
import { useState, useEffect } from "react";
import wifiIcon from "../../assets/wifi.svg";
import lightningIcon from "../../assets/Lightning.svg";
import cleaningIcon from "../../assets/cleaning-brush.svg";
import repairIcon from "../../assets/repair-tools.svg";
import PlusIcon from "../../assets/plus-circle.svg";
import IconArrow from "../../assets/arrow-circle-up.svg";
import FacialConfirmationPopup from "./FacialConfirmationPopup";
import SearchPopup from "../../components/ui/SearchPopup";

import VerifyAuthCapture from "./VerifyAuthCapture";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const Home = () => {
  const searchPopupOpen = useSelector<RootState>(
    (state) => state.user.searchPopupOpen
  ) as boolean;
  const [passwordResetAgent, setPasswordResetAgent] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("isFaceVerified") === "false") {
      setShowConfirmationPopup(true);
    }
  }, []);

  return (
    <div className="w-full justify-center items-center h-screen flex flex-col p-4">
      <div className="garadientBG bg-cover bg-center justify-center w-full h-full items-center flex rounded-xl flex-col px-10">
        {searchPopupOpen && <SearchPopup />}
        {!passwordResetAgent ? (
          <div>
            <div className="flex flex-col gap-3 xl:pl-16">
              <div className="flex flex-row gap-2 items-center mb-12 justify-center">
                <img src={lightningIcon} alt="lightning" className="w-4 h-4" />
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
          <div className="w-full h-full">
            <PasswordResetUi />
          </div>
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

      {showConfirmationPopup && (
        // <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
        //   <div className="relative w-[500px] bg-[#2C2C2E] rounded-3xl p-4">
        //     <button
        //       onClick={() => setShowConfirmationPopup(false)}
        //       className="absolute top-1 right-4 text-xl text-white hover:text-gray-400"
        //       aria-label="Close modal"
        //     >
        //       x
        //     </button>
        //     <div className="bg-[#2C2C2E] rounded-lg p-6">
        //       <div className="flex flex-col items-center">
        //         <h2 className="text-white/90 text-2xl font-normal mb-3">
        //           Face Description Not Found
        //         </h2>
        //         <p className="text-white/70 text-base mb-6">
        //           Your face description is not in our database. Would you like
        //           to add it now?
        //         </p>
        //         <div className="flex gap-4">
        //           <button
        //             onClick={() => {
        //               setShowConfirmationPopup(false);
        //               setShowPopup(true);
        //             }}
        //             className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        //           >
        //             Yes, Add Now
        //           </button>
        //           <button
        //             onClick={() => setShowConfirmationPopup(false)}
        //             className="bg-gray-500 text-white px-4 py-2 rounded-lg"
        //           >
        //             No, Skip
        //           </button>
        //         </div>
        //       </div>
        //     </div>
        //   </div>
        // </div>
        <FacialConfirmationPopup
          showConfirmationPopup={showConfirmationPopup}
          setShowPopup={setShowPopup}
          setShowConfirmationPopup={setShowConfirmationPopup}
        />
      )}

      {showPopup &&
        localStorage.getItem("isFaceVerified") === "false" &&
        !showConfirmationPopup && (
          <div className="fixed inset-0 bg-black/70  flex items-center justify-center z-50">
            <div className="relative w-[500px] bg-[#2C2C2E] rounded-3xl p-4">
              {" "}
              {/* Added background and rounded corners */}
              <button
                onClick={() => setShowPopup(false)}
                className="absolute top-1 right-4 text-xl text-white hover:text-gray-400"
                aria-label="Close modal"
              >
                x
              </button>
              <div className="bg-[#2C2C2E] rounded-lg p-6">
                <div className="flex flex-col items-center">
                  {/* <h2 className="text-white/90 text-2xl font-normal mb-3">
          Verify Your Authentication
        </h2>
        <p className="text-white/70 text-base mb-6">
          Please complete the verification process to continue
        </p> */}
                  <VerifyAuthCapture
                    onVerificationComplete={() => {
                      setShowPopup(false);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default Home;
