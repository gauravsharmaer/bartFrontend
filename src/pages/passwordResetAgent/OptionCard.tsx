// import React from "react";

// interface Option {
//   id: number;
//   text: string;
// }

// interface OptionCardProps {
//   option: Option;
//   onClick: () => void;
//   isSelected: boolean;
// }

// const OptionCard: React.FC<OptionCardProps> = React.memo(
//   ({ option, onClick, isSelected }) => (
//     <button
//       className={`option-card ${
//         isSelected ? "bg-gray-400" : "bg-[#2d2d3e]"
//       } cursor-pointer border ${
//         isSelected ? "border-black" : "border-[#2d2d3e]"
//       } rounded p-2`}
//       onClick={onClick}
//     >
//       {option.text}
//     </button>
//   )
// );

// export default OptionCard;
