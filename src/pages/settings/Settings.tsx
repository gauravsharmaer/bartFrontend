import { CaretRight } from "@phosphor-icons/react";
import SettingsIcon from "../../assets/settings.svg";

export default function SettingsList() {
  return (
    <div className="w-full flex flex-col items-center h-screen p-6 bg-[#121212] ">

    
<div className="w-full h-screen flex flex-col rounded-xl" style={{ background: 'linear-gradient(to left, #15175dea, #292929d5, #292929d5)' }}>
{/* Header */}
      <div className="flex items-center w-[90%] mx-auto my-6">
        <div className="text-white text-xl font-semibold leading-[28.8px] flex items-center gap-2">
          <img src={SettingsIcon} alt="settings" className="w-6 h-6" />
          <span>Settings</span>
        </div>
      </div>

      {/* Account Section */}
      <div className="mx-6 mt-6 mb-2 text-gray-500 text-s font-bold tracking-wider pl-3  text-left">
        ACCOUNT
      </div>
      
      <div className="bg-[#1C1C1E] rounded-xl divide-y divide-[#292929] mx-4 sm:mx-8 md:mx-14 shadow-sm  border-2 border-[#292929]">
      <div className="flex justify-between items-center p-4">
        <span className="text-white text-sm font-medium">Email</span>
        <span className="text-gray-400 text-sm font-normal">
          {localStorage.getItem("email") || "bart.org"}
        </span>
      </div>
      <div className="flex justify-between items-center p-4">
        <span className="text-white text-sm font-medium">Data Control</span>
        <CaretRight size={16} className="text-gray-500" />
      </div>
      <div className="flex justify-between items-center p-4">
        <span className="text-white text-sm font-medium">Saved Chat</span>
        <CaretRight size={16} className="text-gray-500" />
      </div>
    </div>


      {/* About Section */}
      <div className="mx-6 mt-6 mb-4 text-gray-500 text-s font-bold tracking-wider pl-3  text-left">
        ABOUT
      </div>
      <div className="bg-[#1C1C1E] rounded-xl divide-y divide-[#292929] mx-4 sm:mx-8 md:mx-14 shadow-sm border-2 border-[#292929]">
  <div className="flex justify-between items-center p-4">
    <span className="text-white text-sm sm:text-base font-medium">Help Center</span>
    <CaretRight size={16} className="text-gray-500" />
  </div>
  <div className="flex justify-between items-center p-4">
    <span className="text-white text-sm sm:text-base font-medium">Terms of Use</span>
    <CaretRight size={16} className="text-gray-500" />
  </div>
  <div className="flex justify-between items-center p-4">
    <span className="text-white text-sm sm:text-base font-medium">Privacy Policy</span>
    <CaretRight size={16} className="text-gray-500" />
  </div>
  <div className="flex justify-between items-center p-4">
    <span className="text-white text-sm sm:text-base font-medium">App Version</span>
    <div className="flex items-center gap-2">
      <span className="text-gray-400 text-sm sm:text-base font-normal">1.0.0</span>
      <CaretRight size={16} className="text-gray-500" />
    </div>
  </div>
</div>


      
    </div>
    </div>
  );
}



// import { CaretRight } from "@phosphor-icons/react";
// import SettingsIcon from "../../assets/settings.svg";
// export default function SettingsList() {
//   return (
//     <div className="w-full  h-screen flex flex-col  garadientBG">
//       <div className="flex justify-between w-[90%] m-6 items-center">
//         <div className="text-white text-2xl font-semibold  leading-[28.80px] flex gap-2">
//           <img src={SettingsIcon} alt="settings" className="w-8 h-8" />
//           Settings
//         </div>
//       </div>
//       <div className="m-6 flex justify-start opacity-30 text-white text-sm font-semibold  leading-[16.80px] tracking-wide">
//         ACCOUNT
//       </div>
//       <div className="bg-black  rounded-lg divide-y divide-gray-700 m-6">
//         <div className="flex justify-between items-center p-4">
//           <span className="text-white text-sm font-medium  leading-[16.80px]">
//             Email
//           </span>
//           <span className="opacity-70 text-white text-sm font-normal  leading-[16.80px]">
//             {localStorage.getItem("email") || "bart.org"}
//           </span>
//         </div>
//         <div className="flex justify-between items-center p-4">
//           <span className="text-white text-sm font-medium  leading-[16.80px]">
//             Data Control
//           </span>
//           <CaretRight size={16} className="text-gray-400" />
//         </div>
//         <div className="flex justify-between items-center p-4">
//           <span className="text-white text-sm font-medium  leading-[16.80px]">
//             Saved Chat
//           </span>
//           <CaretRight size={16} className="text-gray-400" />
//         </div>
//         {/* <div className="flex justify-between items-center p-4">
//           <span className="text-white text-sm font-medium  leading-[16.80px]">
//             Manage Password
//           </span>
//           <CaretRight size={16} className="text-gray-400" />
//         </div> */}
//       </div>

//       <div className="m-6 flex justify-start opacity-30 text-white text-sm font-semibold  leading-[16.80px] tracking-wide">
//         ABOUT
//       </div>
//       <div className="bg-black text-white rounded-lg divide-y divide-gray-700 m-6">
//         <div className="flex justify-between items-center p-4">
//           <span className="text-white text-sm font-medium  leading-[16.80px]">
//             Help Center
//           </span>
//           <CaretRight size={16} className="text-gray-400" />
//         </div>
//         <div className="flex justify-between items-center p-4">
//           <span className="text-white text-sm font-medium  leading-[16.80px]">
//             Terms of Use
//           </span>
//           <CaretRight size={16} className="text-gray-400" />
//         </div>
//         <div className="flex justify-between items-center p-4">
//           <span className="text-white text-sm font-medium  leading-[16.80px]">
//             Privacy Policy
//           </span>
//           <CaretRight size={16} className="text-gray-400" />
//         </div>
//         <div className="flex justify-between items-center p-4">
//           <span className="text-white text-sm font-medium  leading-[16.80px]">
//             App Version
//           </span>
//           <div className="flex items-center gap-2">
//             <span className="opacity-70 text-white text-sm font-normal  leading-[16.80px]">
//               1.0.0
//             </span>
//             <CaretRight size={16} className="text-gray-400" />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


