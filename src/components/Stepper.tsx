/* eslint-disable @typescript-eslint/no-unused-vars */
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

  complete,
}) => {
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        {steps.map((step, i) => (
          <div
            key={i}
            className="relative flex flex-col justify-center items-center w-36"
          >
            <div
              className={`w-6 h-6 flex items-center justify-center z-10 relative ${
                step < currentStep || complete ? "bg-[#FFFFFF]" : "bg-[#272727]"
              } rounded-[4px] font-semibold text-[#58BE63] rotate-45 text-[14px]`}
            >
              <div className="rotate-[-45deg]">
                {step < currentStep || complete ? <Check size={18} /> : step}
              </div>
            </div>
            {i !== 0 && (
              <div
                className={` bg-[#F3F5F9] absolute w-full h-[0.1px] right-2/4 top-1/2 -translate-y-2/4`}
              ></div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default Stepper;
