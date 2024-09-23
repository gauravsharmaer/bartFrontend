/* eslint-disable @typescript-eslint/no-empty-object-type */
import * as React from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={`h-14 w-[360px] rounded-full p-7 border-none border-1  border-[#282829] bg-[#1D1D1D]
          text-[#AAAAAA] ${className}`}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };
