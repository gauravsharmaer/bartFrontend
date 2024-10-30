// import React, { useState, useCallback, useEffect } from "react";

// interface VideoVerificationCardProps {
//   link: string;
//   isVerificationCompleted: boolean;
//   setFacialAuthLink: (link: string) => void;
//   setShowFacialAuth: (show: boolean) => void;
// }

// const VideoVerificationCard: React.FC<VideoVerificationCardProps> = ({
//   link,
//   isVerificationCompleted,
//   setFacialAuthLink,
//   setShowFacialAuth,
// }) => {
//   const [isSelected, setIsSelected] = useState<boolean>(false);

//   const handleClick = useCallback(() => {
//     setFacialAuthLink(link);
//     setShowFacialAuth(true);
//   }, [link, setFacialAuthLink, setShowFacialAuth]);

//   useEffect(() => {
//     if (isVerificationCompleted) {
//       setIsSelected(true);
//     }
//   }, [isVerificationCompleted]);

//   return (
//     <button
//       className={`video-verification-card ${
//         isSelected ? "bg-gray-400" : "bg-[#2d2d3e]"
//       } cursor-pointer border ${
//         isSelected ? "border-black" : "border-[#2d2d3e]"
//       } rounded p-2`}
//       onClick={handleClick}
//     >
//       Face Recognition
//     </button>
//   );
// };

// export default VideoVerificationCard;
