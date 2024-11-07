// import { useState, useEffect } from "react";

// type ForgetPasswordProps = {
//   active: boolean;
//   closeForgetPasswordpage: () => void;
//   email?: string;
// };

// const ForgotPasswordPopUp: React.FC<ForgetPasswordProps> = (props) => {
//   const [emailInput, setEmailInput] = useState("");

//   useEffect(() => {
//     if (props.email) {
//       setEmailInput(props.email);
//     }
//   }, [props.email]);

//   if (!props.active) {
//     return null;
//   }

//   const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
//     if (e.target === e.currentTarget) {
//       props.closeForgetPasswordpage();
//     }
//   };

//   return (
//     <div
//       className="fixed inset-0 bg-slate-200 bg-opacity-50 flex justify-center items-center z-50"
//       onClick={handleOutsideClick}
//     >
//       <div
//         className="max-w-lg w-full bg-white p-8 rounded-xl shadow shadow-slate-300"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <h1 className="text-4xl font-medium">Reset password</h1>
//         <p className="text-slate-500">Fill up the form to reset the password</p>

//         <form className="my-10">
//           <div className="flex flex-col space-y-5">
//             <label htmlFor="email">
//               <p className="font-medium text-slate-700 pb-2">Email address</p>
//               <input
//                 id="email"
//                 name="email"
//                 type="email"
//                 value={emailInput}
//                 onChange={(e) => setEmailInput(e.target.value)}
//                 className="w-full py-3 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow"
//                 placeholder="Enter email address"
//               />
//             </label>

//             <button
//               type="button"
//               className="w-full py-3 font-medium text-white bg-[#262626] hover:bg-[#303030] rounded-lg border-indigo-500 hover:shadow inline-flex space-x-2 items-center justify-center"
//               // onClick={handleReset}
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 strokeWidth="1.5"
//                 stroke="currentColor"
//                 className="w-6 h-6"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
//                 />
//               </svg>
//               <span>Reset password</span>
//             </button>
//             <p className="text-center">
//               Not registered yet?
//               <a
//                 href="#"
//                 className="text-[#262626] font-medium inline-flex space-x-1 items-center ml-1"
//               >
//                 <span>Register now </span>
//                 <span>
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="h-4 w-4"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
//                     />
//                   </svg>
//                 </span>
//               </a>
//             </p>
//           </div>
//         </form>
//         <button
//           className="absolute top-4 right-4 text-slate-500 hover:text-slate-700"
//           onClick={props.closeForgetPasswordpage}
//         >
//           &times;
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ForgotPasswordPopUp;

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { Input } from "./ui/input";
type ForgetPasswordProps = {
  active: boolean;
  closeForgetPasswordpage: () => void;
  email?: string;
};

const ForgotPasswordPopUp: React.FC<ForgetPasswordProps> = (props) => {
  const [emailInput, setEmailInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (props.email) {
      setEmailInput(props.email);
    }
  }, [props.email]);

  if (!props.active) {
    return null;
  }

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      props.closeForgetPasswordpage();
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const url = "http://localhost:4000/api/users/forgot-password";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: emailInput }),
      });
      const jsonResponse = await response.json();

      if (!response.ok) {
        throw new Error(jsonResponse.message || "An error occurred");
      }

      toast.success("Password reset email sent successfully");
      props.closeForgetPasswordpage();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-[#000000] bg-opacity-70 flex justify-center items-center z-50"
      onClick={handleOutsideClick}
    >
      <div
        className="max-w-lg w-full bg-white p-8 rounded-xl shadow shadow-slate-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between w-full items-center ">
          <div className="flex flex-col gap-1 justify-start items-start pl-2">
            <h1 className="text-4xl font-medium flex items-center">
              Reset password
            </h1>
            <p className="text-slate-500">
              Fill up the form to reset the password
            </p>
          </div>

          <div>
            <button
              className="text-slate-500 hover:text-slate-700 text-2xl  bg-gray-200 rounded-full h-8 w-8 relative bottom-2"
              onClick={props.closeForgetPasswordpage}
            >
              <span className="text-2xl relative bottom-1">&times;</span>
            </button>
          </div>
        </div>

        <form className=" mt-6 mb-1" onSubmit={handleReset}>
          <div className="flex flex-col space-y-3">
            <label htmlFor="email">
              {/* <p className="font-medium text-slate-700 pb-2">Email address</p> */}
              <Input
                id="email"
                name="email"
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-[445px] bg-white text-black border-opacity-40"
                // className="w-full py-3 border border-slate-200 rounded-full px-3 focus:outline-none focus:border-slate-500 hover:shadow
                // "
                placeholder="Enter email address"
                required
              />
            </label>

            <button
              type="submit"
              className="w-full py-5 font-medium text-white bg-[#262626] hover:bg-[#303030] rounded-full border-indigo-500 hover:shadow inline-flex space-x-2 items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
                  />
                </svg>
              )}
              <span>{isLoading ? "Sending Email..." : "Reset password"}</span>
            </button>

            <p className="text-center">
              Not registered yet?
              <Link
                to="/signup"
                className="text-[#262626] font-medium inline-flex space-x-1 items-center ml-1"
              >
                <span className="text-blue-600">Signup now </span>
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </span>
              </Link>
            </p>
          </div>
        </form>
        <button
          className="absolute top-4 right-4 text-slate-500 hover:text-slate-700"
          onClick={props.closeForgetPasswordpage}
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default ForgotPasswordPopUp;
