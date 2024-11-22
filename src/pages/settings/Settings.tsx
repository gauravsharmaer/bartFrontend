import { CaretRight } from "@phosphor-icons/react";
import SettingsIcon from "../../assets/settings.svg";
export default function SettingsList() {
  return (
    <div className="w-full  h-screen flex flex-col  garadientBG">
      <div className="flex justify-between w-[90%] m-6 items-center">
        <div className="text-white text-2xl font-semibold  leading-[28.80px] flex gap-2">
          <img src={SettingsIcon} alt="settings" className="w-8 h-8" />
          Settings
        </div>
      </div>
      <div className="m-6 flex justify-start opacity-30 text-white text-sm font-semibold  leading-[16.80px] tracking-wide">
        ACCOUNT
      </div>
      <div className="bg-black  rounded-lg divide-y divide-gray-700 m-6">
        <div className="flex justify-between items-center p-4">
          <span className="text-white text-sm font-medium  leading-[16.80px]">
            Email
          </span>
          <span className="opacity-70 text-white text-sm font-normal  leading-[16.80px]">
            {localStorage.getItem("email") || "bart.org"}
          </span>
        </div>
        <div className="flex justify-between items-center p-4">
          <span className="text-white text-sm font-medium  leading-[16.80px]">
            Data Control
          </span>
          <CaretRight size={16} className="text-gray-400" />
        </div>
        <div className="flex justify-between items-center p-4">
          <span className="text-white text-sm font-medium  leading-[16.80px]">
            Saved Chat
          </span>
          <CaretRight size={16} className="text-gray-400" />
        </div>
        {/* <div className="flex justify-between items-center p-4">
          <span className="text-white text-sm font-medium  leading-[16.80px]">
            Manage Password
          </span>
          <CaretRight size={16} className="text-gray-400" />
        </div> */}
      </div>

      <div className="m-6 flex justify-start opacity-30 text-white text-sm font-semibold  leading-[16.80px] tracking-wide">
        ABOUT
      </div>
      <div className="bg-black text-white rounded-lg divide-y divide-gray-700 m-6">
        <div className="flex justify-between items-center p-4">
          <span className="text-white text-sm font-medium  leading-[16.80px]">
            Help Center
          </span>
          <CaretRight size={16} className="text-gray-400" />
        </div>
        <div className="flex justify-between items-center p-4">
          <span className="text-white text-sm font-medium  leading-[16.80px]">
            Terms of Use
          </span>
          <CaretRight size={16} className="text-gray-400" />
        </div>
        <div className="flex justify-between items-center p-4">
          <span className="text-white text-sm font-medium  leading-[16.80px]">
            Privacy Policy
          </span>
          <CaretRight size={16} className="text-gray-400" />
        </div>
        <div className="flex justify-between items-center p-4">
          <span className="text-white text-sm font-medium  leading-[16.80px]">
            App Version
          </span>
          <div className="flex items-center gap-2">
            <span className="opacity-70 text-white text-sm font-normal  leading-[16.80px]">
              1.0.0
            </span>
            <CaretRight size={16} className="text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );
}
