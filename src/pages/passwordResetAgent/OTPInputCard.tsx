// import React, { useCallback, useEffect, useRef, useState } from "react";

// interface OTPInputCardProps {
//   onSubmitOTP: (displayText: string) => void;
//   otp: string[];
//   setOtp: React.Dispatch<React.SetStateAction<string[]>>;
// }

// const OTPInputCard: React.FC<OTPInputCardProps> = React.memo(
//   ({ onSubmitOTP, otp, setOtp }) => {
//     const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
//     const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

//     useEffect(() => {
//       inputRefs.current[0]?.focus();
//     }, []);

//     useEffect(() => {
//       const firstEmptyIndex = otp.findIndex((value) => value === "");
//       if (firstEmptyIndex >= 0) {
//         inputRefs.current[firstEmptyIndex]?.focus();
//       }
//     }, [otp]);

//     const handleChange = useCallback(
//       (index: number, value: string) => {
//         const newOtp = [...otp];
//         newOtp[index] = value.slice(-1);
//         setOtp(newOtp);

//         if (value && index < otp.length - 1) {
//           inputRefs.current[index + 1]?.focus();
//         }
//       },
//       [otp, setOtp]
//     );

//     const handleKeyDown = useCallback(
//       (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
//         if (event.key === "Backspace") {
//           event.preventDefault();
//           if (!otp[index] && index > 0) {
//             inputRefs.current[index - 1]?.focus();
//             const updatedOtp = [...otp];
//             updatedOtp[index - 1] = "";
//             setOtp(updatedOtp);
//           } else {
//             const updatedOtp = [...otp];
//             updatedOtp[index] = "";
//             setOtp(updatedOtp);
//           }
//         } else if (event.key === "Enter") {
//           handleSubmit();
//         }
//       },
//       [otp, setOtp]
//     );

//     const handleSubmit = useCallback(() => {
//       if (otp.every((digit) => digit !== "")) {
//         setIsSubmitted(true);
//         onSubmitOTP("Done");
//       } else {
//         // Show an error message or handle incomplete OTP
//         console.log("Please enter all OTP digits");
//       }
//     }, [otp, onSubmitOTP]);

//     if (isSubmitted) return null;

//     return (
//       <div className="otp-input-card bg-gray-800 p-4 rounded-lg">
//         <div className="otp-label text-white mb-2">Please enter OTP below</div>
//         <div className="otp-inputs flex gap-2">
//           {otp.map((value, index) => (
//             <input
//               key={index}
//               type="text"
//               inputMode="numeric"
//               pattern="\d*"
//               value={value}
//               onChange={(e) => handleChange(index, e.target.value)}
//               onKeyDown={(e) => handleKeyDown(index, e)}
//               onFocus={(e) => e.target.select()}
//               maxLength={1}
//               ref={(el) => (inputRefs.current[index] = el)}
//               className="otp-input w-10 h-10 text-center bg-gray-700 text-white border border-gray-600 rounded"
//             />
//           ))}
//         </div>
//         <button
//           className="otp-submit-btn bg-blue-500 text-white px-4 py-2 rounded mt-4"
//           onClick={handleSubmit}
//         >
//           Submit
//         </button>
//       </div>
//     );
//   }
// );

// export default OTPInputCard;
