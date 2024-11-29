import { useState } from "react";
import { Input } from "../../components/ui/input";
import { MagnifyingGlass, X } from "@phosphor-icons/react";
import { setSearchPopupOpen } from "../../redux/userSlice";
import { useDispatch } from "react-redux";
export default function SearchPopup() {
  const [isOpen, setIsOpen] = useState(true);
  const dispatch = useDispatch();
  const handleClose = () => {
    setIsOpen(false);
    dispatch(setSearchPopupOpen(false));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-90 z-50">
      <div className="w-full max-w-[725px] h-[500px] p-6 bg-[#1B1B1B] rounded-2xl flex flex-col gap-8">
        <div className="flex justify-between items-center">
          <div className="flex-1 h-[44px] p-2.5 bg-[#1B1B1B] rounded-full border border-[#2E2E36] flex items-center gap-2.5">
            <MagnifyingGlass size={16} color="white" />
            <Input
              type="text"
              placeholder="Search"
              className="bg-transparent border-0 text-white text-sm font-normal leading-[16.8px] w-full focus:outline-none"
            />
          </div>
          <button
            onClick={handleClose}
            className="bg-transparent border-0 cursor-pointer p-0"
          >
            <X size={20} color="white" weight="bold" />
          </button>
        </div>
        <div className="flex gap-2 items-center">
          {[
            { text: "Ticket #65432", color: "#589BFF" },
            { text: "Password Reset", color: "#E8BC19" },
            { text: "Ticket #65432", color: "#A88FFF" },
          ].map((badge, index) => (
            <div
              key={index}
              className="p-2.5 bg-[#2B2B2B] rounded-full overflow-hidden flex justify-center items-center"
            >
              <div
                style={{
                  color: badge.color,
                  fontSize: "10px",
                  fontFamily: "Graphik, sans-serif",
                  fontWeight: "500",
                  lineHeight: "13px",
                  letterSpacing: "0.1px",
                }}
              >
                {badge.text}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
