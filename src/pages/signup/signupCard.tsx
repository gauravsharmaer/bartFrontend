import { useState, useRef, useEffect } from "react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import avatar from "../../assets/Genie.svg";
import { z } from "zod";
import Webcam from "react-webcam";
import { useNavigate } from "react-router-dom";
import { validateSignUpSchema } from "../../utils/authValidate";
import { toast } from "react-toastify";
import Stepper from "../../components/Stepper";
import usePasswordToggle from "../../hooks/usePasswordToggle";
import AuthSwitcher from "../../components/AuthSwitcher";
import * as faceapi from "face-api.js";

// Validation schemas
const Step1Schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
});

const Step2Schema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const SignupCard = () => {
  const navigate = useNavigate();
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [currentStep, setCurrentStep] = useState(1); // Start from step 1
  const [complete, setComplete] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [phoneNumberError, setPhoneNumberError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const [processingFaceApi, setProcessingFaceApi] = useState<boolean>(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState<
    string | null
  >(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [faceDescriptor, setFaceDescriptor] = useState<Float32Array | null>(
    null
  );
  const { InputType, Icon } = usePasswordToggle();

  const steps = [1, 2, 3];
  const videoConstraints = {
    facingMode: "user",
  };

  const MODEL_URL = "/models";

  const clearErrors = () => {
    setEmailError(null);
    setPasswordError(null);
    setPhoneNumberError(null);
    setNameError(null);
    setConfirmPasswordError(null);
    setImageError(null);
  };

  useEffect(() => {
    const loadModels = async () => {
      try {
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        ]);
        // toast.success("Face detection models loaded successfully");
      } catch (error) {
        console.error("Error loading face-api models:", error);
        toast.error(
          "Failed to load face detection models. Please check your internet connection and refresh the page."
        );
        setImageError("Failed to load face detection models");
      }
    };

    loadModels();
  }, []);

  const capturePhoto = async () => {
    if (!webcamRef.current) {
      toast.error(
        "Camera not initialized. Please allow camera access and try again."
      );
      setImageError("Camera access required");
      return;
    }

    try {
      const screenshot = webcamRef.current.getScreenshot();
      if (!screenshot) {
        toast.error(
          "Failed to capture photo. Please check your camera permissions."
        );
        setImageError("Photo capture failed");
        return;
      }

      setImageSrc(screenshot);
      setCameraOn(false);
      if (currentStep === 3) {
        setProcessingFaceApi(true);
      }
      // toast.info("Processing captured image...");
      await processFaceApi(screenshot);
    } catch (error) {
      console.error("Error capturing photo:", error);
      toast.error("Failed to capture photo. Please try again.");
      setImageError("Photo capture error");
      setProcessingFaceApi(false);
    }
  };

  const processFaceApi = async (imageSrc: string) => {
    if (!imageSrc) {
      toast.error("No image provided for processing");
      setImageError("No image to process");
      return;
    }

    try {
      //loading the image from the captured photo
      const img = await faceapi.fetchImage(imageSrc).catch(() => {
        throw new Error("Failed to load captured image");
      });

      //detecting the face in the image
      const detections = await faceapi
        .detectSingleFace(img)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detections) {
        setImageError(
          "No face detected. Please ensure your face is clearly visible."
        );
        setFaceDescriptor(null);
        toast.error(
          "No face detected in the image. Please try again with better lighting and positioning."
        );
        return;
      }

      //extracting the face features from the image
      if (!detections.descriptor) {
        setImageError("Failed to extract face features. Please try again.");
        setFaceDescriptor(null);
        toast.error("Face feature extraction failed. Please try again.");
        return;
      }

      //setting the face descriptor to the state
      setFaceDescriptor(detections.descriptor);
      setImageError(null);
      toast.success("Face captured and processed successfully!");

      //drawing the face detection box on the image
      const canvas = canvasRef.current;
      if (!canvas) {
        console.error("Canvas reference not found");
        return;
      }

      //getting the canvas context
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        console.error("Failed to get canvas context");
        return;
      }

      //setting the canvas width and height to the image width and height
      canvas.width = img.width;
      canvas.height = img.height;

      //clearing the canvas
      // This erases anything previously drawn on the canvas
      // Like wiping a whiteboard clean before drawing something new
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      //drawing the face detection box on the image
      const box = detections.detection.box;
      ctx.strokeStyle = "#00ff00";
      ctx.lineWidth = 2;
      ctx.strokeRect(box.x, box.y, box.width, box.height);
    } catch (error) {
      console.error("Error processing face:", error);
      setImageError(
        "Failed to process face. Please try again with better lighting."
      );
      setFaceDescriptor(null);
      toast.error(
        "Face processing failed. Please ensure good lighting and a clear face view."
      );
    } finally {
      setProcessingFaceApi(false);
    }
  };

  const handleNext = () => {
    clearErrors();

    if (currentStep === steps.length) {
      if (!faceDescriptor) {
        toast.error("Please capture your face photo before proceeding");
        setImageError("Face photo required");
        return;
      }
      setComplete(true);
      return;
    }

    try {
      if (currentStep === 1) {
        Step1Schema.parse({ email, phoneNumber, name });
      } else if (currentStep === 2) {
        Step2Schema.parse({ password, confirmPassword });
      } else if (currentStep === 3) {
        if (!imageSrc) {
          toast.error("Please capture your photo before proceeding");
          setImageError("Photo capture required");
          return;
        }
        if (!faceDescriptor) {
          toast.error("Please ensure your face is properly captured");
          setImageError("Valid face photo required");
          return;
        }
      }

      setCurrentStep((prev) => prev + 1);
    } catch (error) {
      //handling the validation errors
      //ZodError is a class that is used to handle the validation errors
      //The instanceof operator in JavaScript/TypeScript checks if an object
      //is an instance of a specific class or constructor function.
      //It's like checking "what type of thing is this?"
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          const field = err.path[0];
          const errorMessage = err.message;
          switch (field) {
            case "email":
              setEmailError(errorMessage);

              break;
            case "password":
              setPasswordError(errorMessage);

              break;
            case "confirmPassword":
              setConfirmPasswordError(errorMessage);

              break;
            case "phoneNumber":
              setPhoneNumberError(errorMessage);

              break;
            case "name":
              setNameError(errorMessage);

              break;
          }
        });
      }
    }
  };

  const handleSignUp = async () => {
    if (!imageSrc) {
      toast.error("Please capture your photo before signing up");
      setImageError("Photo required for signup");
      return;
    }

    if (!faceDescriptor) {
      toast.error(
        "Please ensure your face is properly captured before signing up"
      );
      setImageError("Valid face photo required for signup");
      return;
    }

    const validationResponse = validateSignUpSchema({
      name,
      email,
      password,
      confirmPassword,
      phoneNumber,
    });

    if (!validationResponse.success) {
      validationResponse.error.issues.forEach((issue) => {
        toast.error(issue.message, {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      });
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          confirmPassword,
          phoneNumber,
          faceDescriptor: Array.from(faceDescriptor),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error occurred during signup");
      }

      toast.success("Signup successful! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("Signup error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "An error occurred during signup. Please try again."
      );
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div className="flex flex-col gap-3 justify-center items-center">
        <div className="flex flex-col justify-center items-center mb-4">
          <img src={avatar} alt="avatar" className="w-12 h-12 rounded-full" />
          <h2
            className="text-white text-2xl mt-2"
            style={{ fontFamily: "Times New Roman" }}
          >
            Signup
          </h2>
        </div>

        <div>
          <Stepper
            steps={steps}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            complete={complete}
            setComplete={setComplete}
          />
        </div>

        <div className="flex flex-col gap-3 justify-center items-center">
          {currentStep === 1 && (
            <>
              <Input
                type="text"
                error={nameError}
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                type="text"
                error={phoneNumberError}
                placeholder="Phone Number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              <Input
                type="email"
                placeholder="Email"
                error={emailError}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </>
          )}

          {currentStep === 2 && (
            <>
              <Input
                error={passwordError}
                type={InputType}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={Icon}
              />
              <Input
                error={confirmPasswordError}
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
              {!cameraOn && !imageSrc && (
                <Button onClick={() => setCameraOn(true)}>
                  Activate Camera & Capture Photo
                </Button>
              )}
              {cameraOn && (
                <div>
                  <Webcam
                    audio={false}
                    height={300}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    width={300}
                    videoConstraints={videoConstraints}
                    className="mb-2"
                    onUserMediaError={() => {
                      toast.error(
                        "Failed to access camera. Please check permissions."
                      );
                      setCameraOn(false);
                    }}
                  />
                  <Button onClick={capturePhoto}>Capture Photo</Button>
                </div>
              )}

              {imageSrc && !cameraOn && (
                <div className="relative w-72 h-72">
                  <img
                    src={imageSrc}
                    alt="Captured"
                    className="w-full h-52 object-cover"
                  />
                  <canvas
                    ref={canvasRef}
                    className="absolute top-0 left-0 w-full h-52"
                  />
                  <Button
                    className="my-4"
                    onClick={() => {
                      setCameraOn(true);
                      setImageSrc(null);
                      setFaceDescriptor(null);
                      setImageError(null);
                    }}
                    disabled={processingFaceApi}
                  >
                    Recapture Photo
                  </Button>
                </div>
              )}

              {imageError && (
                <p className="text-red-500 text-center mt-2 w-72">
                  {imageError}
                </p>
              )}
            </div>
          )}

          {processingFaceApi && (
            <p className=" text-yellow-500">
              Processing face... Please wait and don't close the window
            </p>
          )}

          {!complete && (
            <Button
              className="mt-6"
              disabled={processingFaceApi}
              onClick={currentStep === steps.length ? handleSignUp : handleNext}
            >
              {currentStep === steps.length ? "Signup" : "Next"}
            </Button>
          )}
        </div>

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
