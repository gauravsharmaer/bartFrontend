/* eslint-disable @typescript-eslint/no-empty-object-type */

// import * as React from "react";

// export interface AuthBackgroundProps
//   extends React.HTMLAttributes<HTMLDivElement> {}

// const HomeBackground = React.forwardRef<HTMLDivElement, AuthBackgroundProps>(
//   ({ className = "", ...props }, ref) => (
//     <div
//       ref={ref}
//       className={`bg-[url('/homeBackground.svg')]
//    flex justify-center items-center h-screen
//     bg-cover bg-center w-screen absolute top-0 left-0 ${className}`}
//       {...props}
//     />
//   )
// );

// HomeBackground.displayName = "HomeBackground";

// export { HomeBackground };

import * as React from "react";

export interface AuthBackgroundProps
  extends React.HTMLAttributes<HTMLDivElement> {}

const HomeBackground = React.forwardRef<HTMLDivElement, AuthBackgroundProps>(
  ({ className = "", ...props }, ref) => (
    <div
      ref={ref}
      className={`bg-[url('/homeBackground.svg')]
   flex justify-center items-center h-screen
    bg-cover bg-center  ${className}`}
      {...props}
    />
  )
);

HomeBackground.displayName = "HomeBackground";

export { HomeBackground };
