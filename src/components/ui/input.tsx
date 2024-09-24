/* eslint-disable @typescript-eslint/no-empty-object-type */

// import * as React from "react";

// export interface InputProps
//   extends React.InputHTMLAttributes<HTMLInputElement> {}

// const Input = React.forwardRef<HTMLInputElement, InputProps>(
//   ({ className = "", type, ...props }, ref) => {
//     return (
//       <input
//         type={type}
//         className={`h-[58px] w-[360px] rounded-full p-7 border-none border-1  border-[#282829] bg-[#1D1D1D]
//           text-[#AAAAAA] ${className}`}
//         ref={ref}
//         {...props}
//       />
//     );
//   }
// );

// Input.displayName = "Input";

// export { Input };

import * as React from "react";
import { useState, useRef, useEffect } from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", type, placeholder = "", ...props }, ref) => {
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
      setIsFilled(!!e.target.value); // Check if input has content
      if (props.onChange) props.onChange(e); // Pass the onChange event if provided
    };

    const handleLabelClick = () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };

    return (
      <div className="relative w-[360px]">
        <input
          type={type}
          className={`h-[58px] w-full rounded-full p-7 border-none border-1  border-[#282829] bg-[#1D1D1D] focus:outline-none
            text-[#AAAAAA] peer ${className}`}
          ref={inputRef}
          placeholder=" " // Empty placeholder to reserve space for the floating label
          onChange={handleInputChange}
          {...props}
        />
        <label
          className={`absolute left-7 top-[16%] text-[12px] transform -translate-y-1/2 text-[#AAAAAA] transition-all duration-200 cursor-text
    ${
      isFilled
        ? " text-[#888] text-[12px]"
        : "peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base left-9"
    }`}
          onClick={handleLabelClick}
        >
          {placeholder}
        </label>
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
