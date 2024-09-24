/* eslint-disable @typescript-eslint/no-empty-object-type */
import * as React from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={`h-[58px] w-[360px] rounded-full px-4 py-3 border-none
          bg-[#2C2C2E] text-[#E5E5E7] placeholder-[#cececf] shadow-sm 
          focus:outline-none focus:ring-2 focus:ring-[#3A3A3C] ${className}`}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };
