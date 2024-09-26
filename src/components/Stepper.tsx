/* eslint-disable @typescript-eslint/no-unused-vars */
// import { useState } from "react";
// import { Button } from "./ui/button";
// import { Check } from "@phosphor-icons/react";

// const Stepper = () => {
//   const steps = [1, 2, 3];
//   const [currentStep, setCurrentStep] = useState(1);
//   const [complete, setComplete] = useState(false);

//   const handleNext = () => {
//     if (currentStep === steps.length) {
//       setComplete(true);
//     } else {
//       setCurrentStep((prev) => prev + 1);
//     }
//   };

//   return (
//     <>
//       <div className="flex justify-between">
//         {steps.map((step, i) => (
//           <div
//             key={i}
//             className={`relative flex flex-col justify-center items-center w-36 ${
//               currentStep === step ? "active" : ""
//             } ${step < currentStep || complete ? "complete" : ""}`}
//           >
//             <div
//               className={`w-8 h-8 flex items-center justify-center z-10 relative bg-white rounded-[4px] font-semibold text-green-600 rotate-45 ${
//                 currentStep === step ? "bg-white" : ""
//               } ${step < currentStep || complete ? "bg-white" : ""}`}
//             >
//               <div className="rotate-[-45deg]">
//                 {step < currentStep || complete ? <Check size={24} /> : step}
//               </div>
//             </div>
//             {i !== 0 && (
//               <div
//                 className={`content-[''] bg-slate-200 absolute w-full h-[3px] right-2/4 top-1/2 -translate-y-2/4 ${
//                   step < currentStep || complete || currentStep === step
//                     ? "bg-white"
//                     : ""
//                 }`}
//               ></div>
//             )}
//           </div>
//         ))}
//       </div>

//       {!complete && (
//         <Button onClick={handleNext}>
//           {currentStep === steps.length ? "Finish" : "Next"}
//         </Button>
//       )}
//     </>
//   );
// };

// export default Stepper;

import { Button } from "./ui/button";
import { Check } from "@phosphor-icons/react";

interface StepperProps {
  steps: number[];
  currentStep: number;
  setCurrentStep: (step: number) => void;
  complete: boolean;
  setComplete: (complete: boolean) => void;
}

const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStep,
  setCurrentStep,
  complete,
  setComplete,
}) => {
  return (
    <>
      <div className="flex justify-between">
        {steps.map((step, i) => (
          <div
            key={i}
            className="relative flex flex-col justify-center items-center w-36"
          >
            <div
              className={`w-8 h-8 flex items-center justify-center z-10 relative bg-white rounded-[4px] font-semibold text-green-600 rotate-45`}
            >
              <div className="rotate-[-45deg]">
                {step < currentStep || complete ? <Check size={24} /> : step}
              </div>
            </div>
            {i !== 0 && (
              <div
                className={`content-[''] bg-slate-200 absolute w-full h-[3px] right-2/4 top-1/2 -translate-y-2/4`}
              ></div>
            )}
          </div>
        ))}
      </div>

      {/* {!complete && (
        <Button onClick={handleNext}>
          {currentStep === steps.length ? "Finish" : "Next"}
        </Button>
      )} */}
    </>
  );
};

export default Stepper;
