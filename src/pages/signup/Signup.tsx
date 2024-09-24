import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import avatar from '../../assets/avatar.svg'; // Adjust the path as needed
import React from "react";

const Signup = () => {
  return (
    <div
      className="bg-[url('/background.jpg')]
     flex justify-center items-center h-screen
      bg-cover bg-center w-screen absolute top-0 left-0"
    >
<div className="grid grid-cols-2 gap-x-1">
<div className="flex flex-col items-start w-[160vh] pl-20 -mr-60">
      <video
            className="w-[80vh] h-[90vh] object-cover rounded-[30px]"
            src="/video.mp4"
            muted={true}
            playsInline={true}
            loop={true}
            autoPlay={true}
            controls={false}
          />
          
        </div>

        <div className="flex  justify-center items-center ">
          <div className="flex flex-col gap-4">
             {/* Logo/Avatar and Signup Heading */}
          <div className="flex flex-col justify-center items-center mb-4">
          <img
          src={avatar}
          alt="avatar"
          className="w-[50px] h-[50px] rounded-full"
            />

          <h2 className="text-white text-2xl mt-2" style={{ fontFamily: 'Times New Roman' }}>Signup</h2>
            </div>
            <Input
              type="text"
              placeholder="Full Name"
              
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              type="text"
              placeholder="Phone Number"
              onChange={(e) => setPhoneNumber(e.target.value)}
            />

            <Input
              type="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />

            <Input
              type="password"
              placeholder="Confirm Password"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button className="mt-1">Next</Button>
            {/* Login Link */}
            <p className="text-[#ffff] text-sm mt-2 text-white underline">
              Already have an account?{" "}
              <a href="/login" className="text-white underline">
                Login
              </a>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
