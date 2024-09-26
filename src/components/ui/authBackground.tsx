/* eslint-disable @typescript-eslint/no-empty-object-type */

import * as React from "react";

export interface AuthBackgroundProps
  extends React.HTMLAttributes<HTMLDivElement> {}

const AuthBackground = React.forwardRef<HTMLDivElement, AuthBackgroundProps>(
  ({ className = "", ...props }, ref) => (
    <div
      ref={ref}
      className={`bg-[url('/background.jpg')]
   flex justify-center items-center h-screen
    bg-cover bg-center w-screen absolute top-0 left-0 ${className}`}
      {...props}
    />
  )
);

AuthBackground.displayName = "AuthBackground";

export { AuthBackground };
