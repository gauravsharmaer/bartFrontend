import * as React from "react";
import { useState, useRef, useEffect } from "react";

import { Info } from "@phosphor-icons/react";
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  error?: string | null;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className = "", type, placeholder = "", icon, error = "", ...props },
    ref
  ) => {
    const [isFilled, setIsFilled] = useState(false);
    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
      if (ref && typeof ref === "function") {
        ref(inputRef.current);
      } else if (ref) {
        (ref as React.MutableRefObject<HTMLInputElement | null>).current =
          inputRef.current;
      }
    }, [ref]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setIsFilled(!!e.target.value);
      if (props.onChange) props.onChange(e);
    };

    const handleLabelClick = () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };

    return (
      <div className="relative w-96 mb-1">
        <div className="relative">
          <input
            type={type}
            className={`h-16 rounded-full p-7 border bg-[#1D1D1D] focus:outline-none
              text-[white] peer ${
                error ? "border-red-500" : "border-[#282829]"
              } ${icon ? "pr-12" : ""} ${className}`}
            ref={inputRef}
            placeholder=" "
            onChange={handleInputChange}
            {...props}
          />

          <label
            className={`absolute left-7 top-[20%] text-[12px] transform -translate-y-1/2
               text-[#AAAAAA] transition-all duration-200 cursor-text
              ${
                isFilled
                  ? "text-[#888] text-[12px] "
                  : "peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base mb-1"
              }`}
            onClick={handleLabelClick}
          >
            {placeholder}
          </label>

          {icon && (
            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#69696C] cursor-pointer">
              {icon}
            </span>
          )}
        </div>
        {error && (
          <div className="text-red-500 text-sm flex justify-start pl-5 gap-1 mt-1">
            <span className="mt-[2px]">
              <Info size={16} />
            </span>
            <span className="text-sm">{error}</span>
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
