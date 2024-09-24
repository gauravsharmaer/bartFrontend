import { Input } from "../../components/ui/input";
import React from "react";

const Signup = () => {
  return (
    <div
      className="bg-[url('/background.jpg')]
     flex justify-center items-center h-screen
      bg-cover bg-center w-screen absolute top-0 left-0"
    >
      <div className="grid grid-cols-2 ">
        <div className="flex justify-center items-center flex-col">
          <video
            className="w-[80vh] h-[90vh] object-cover rounded-xl"
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
            <Input
              type="text"
              placeholder="Name"
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              type="text"
              placeholder="Phone"
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
