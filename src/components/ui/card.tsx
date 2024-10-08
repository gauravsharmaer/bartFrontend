import React from "react";

interface CardProps {
  title: string;
  icon: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ title, icon, onClick }) => {
  return (
    <div
      className="bg-[#262626] border border-[#313131] rounded-xl px-5 py-4 w-[18rem] h-36 opacity-40 cursor-pointer"
      onClick={onClick}
    >
      <div className="rounded-md flex flex-col gap-3">
        <img src={icon} alt="icon" className="w-12 h-12" />
        <div className="text-[#FFFFFF] text-[14px] font-normal text-left">
          {title}
        </div>
      </div>
    </div>
  );
};

export default Card;
