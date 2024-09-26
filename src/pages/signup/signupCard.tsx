/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useRef, useEffect } from "react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import avatar from "../../assets/Genie.svg";

import Webcam from "react-webcam";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

import { validateSignUpSchema } from "../../utils/validateSignup";

import {
  REACT_APP_AWS_ACCESS_KEY_ID,
  REACT_APP_AWS_SECRET_ACCESS_KEY,
  REACT_APP_AWS_REGION,
} from "../../config";
import Stepper from "../../components/Stepper";
import usePasswordToggle from "../../hooks/usePasswordToggle";
import AuthSwitcher from "../../components/AuthSwitcher";
const SignupCard = () => {
  const webcamRef = useRef<Webcam | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [imageLink, setImageLink] = useState("");
  const { InputType, Icon } = usePasswordToggle();
  const steps = [1, 2, 3];
  const [currentStep, setCurrentStep] = useState(1);
  const [complete, setComplete] = useState(false);
  const videoConstraints = {
    facingMode: "user",
  };

  // Initialize S3 client globally
  const s3Client = new S3Client({
    region: REACT_APP_AWS_REGION,
    credentials: {
      accessKeyId: REACT_APP_AWS_ACCESS_KEY_ID,
      secretAccessKey: REACT_APP_AWS_SECRET_ACCESS_KEY,
    },
  });

  const capturePhoto = async () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setImageSrc(imageSrc as string);

      const stream = webcamRef.current.video?.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      setCameraOn(false);
    }
  };

  const handleNext = () => {
    if (currentStep === steps.length) {
      setComplete(true);
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSignUp = async () => {
    const validationResponse = validateSignUpSchema({
      name,
      email,
      password,
      confirmPassword,
      phoneNumber,
      image: imageLink,
    });

    if (!validationResponse.success) {
      const errorMessages = validationResponse.error.errors
        .map((err) => err.message)
        .join(", ");
      throw new Error(errorMessages);
    }

    const url = `http://localhost:4000/api/users/register`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        email: email,
        password: password,
        confirmPassword: confirmPassword,
        phoneNumber: phoneNumber,
        image: imageLink,
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error_msg || "Error ");
    }

    const data = await response.json();
    return data;
  };

  useEffect(() => {
    uploadToAws();
  }, [imageSrc, email]);

  const uploadToAws = async () => {
    if (imageSrc && email) {
      const base64Image = imageSrc.split(",")[1];
      const binaryImage = atob(base64Image);
      const arrayBuffer = new ArrayBuffer(binaryImage.length);
      const uint8Array = new Uint8Array(arrayBuffer);

      for (let i = 0; i < binaryImage.length; i++) {
        uint8Array[i] = binaryImage.charCodeAt(i);
      }

      const blob = new Blob([uint8Array], { type: "image/jpeg" });

      const imageParams = {
        Bucket: "face-authen",
        Key: `facialdata/profile_images/${email}.jpg`,
        Body: blob,
        ContentType: "image/jpeg",
      };

      try {
        // Upload the image using the new AWS S3 V3 SDK
        const command = new PutObjectCommand(imageParams);
        const data = await s3Client.send(command);
        if (data) {
          const imageUrl = `https://face-authen.s3.us-east-1.amazonaws.com/facialdata/profile_images/${email}.jpg`;
          setImageLink(imageUrl);
          console.log("Image uploaded successfully. URL:", imageUrl);
        }
        // console.log("Image uploaded successfully:", data);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  const handleCaptureButtonClick = () => {
    setCameraOn(true);
  };

  return (
    <div className="flex  justify-center items-center ">
      <div className="flex flex-col gap-4">
        {/* Logo/Avatar and Signup Heading */}
        <div className="flex flex-col justify-center items-center mb-4">
          <img
            src={avatar}
            alt="avatar"
            className="w-[50px] h-[50px] rounded-full"
          />

          <h2
            className="text-white text-2xl mt-2"
            style={{ fontFamily: "Times New Roman" }}
          >
            Signup
          </h2>
        </div>
        <Stepper
          steps={steps}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          complete={complete}
          setComplete={setComplete}
        />
        {currentStep === 1 && (
          <>
            <Input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              type="text"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />

            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </>
        )}

        {currentStep === 2 && (
          <>
            <Input
              type={InputType}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={Icon}
            />

            <Input
              type={InputType}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              icon={Icon}
            />
          </>
        )}

        {currentStep === 3 && (
          <div>
            {" "}
            {!cameraOn && (
              <Button onClick={handleCaptureButtonClick}>
                Activate Camera & Capture Photo
              </Button>
            )}
            {cameraOn && (
              <div>
                <Webcam
                  audio={false}
                  height={400}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  width={400}
                  videoConstraints={videoConstraints}
                />
                <Button onClick={capturePhoto}>Capture Photo</Button>
              </div>
            )}
            {imageSrc && (
              <div>
                <h2>Captured Photo:</h2>
                <img src={imageSrc} alt="Captured" />
              </div>
            )}
          </div>
        )}
        {/* 
        <Button className="mt-1" onClick={handleSignUp}>
          Next
        </Button> */}
        {!complete && (
          <Button
            onClick={currentStep === steps.length ? handleSignUp : handleNext}
          >
            {currentStep === steps.length ? "Signup" : "Next"}
          </Button>
        )}

        <AuthSwitcher
          text="Already have an account?"
          href="/login"
          page="Login"
        />
      </div>
    </div>
  );
};

export default SignupCard;
