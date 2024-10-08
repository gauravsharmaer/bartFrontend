import { useState, useRef, useEffect } from "react";
import {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
} from "@aws-sdk/client-s3";

import {
  RekognitionClient,
  DetectFacesCommand,
  CompareFacesCommand,
} from "@aws-sdk/client-rekognition";
import Webcam from "react-webcam";
import { Buffer } from "buffer";
import Eye from "../../assets/eye.svg";
import Face from "../../assets/Face.gif";

import { awsConfig } from "../../utils/awsUtils";
import { Attribute } from "@aws-sdk/client-rekognition";

// Initialize AWS clients
const s3Client = new S3Client(awsConfig);
const rekognitionClient = new RekognitionClient(awsConfig);

// interface HomeProps {
//   onClose: () => void;
//   onComplete: () => void;
// }

// Main Home component for facial recognition and liveness detection
const AuthvideoCard = () => {
  // State management using useState hooks
  const [error, setError] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [instruction, setInstruction] = useState<string | JSX.Element>("");
  const [progress, setProgress] = useState(0);
  const [showGif, setShowGif] = useState(false);

  // Refs for managing webcam, intervals, and action sequence
  const webcamRef = useRef<Webcam>(null);
  const analyzeIntervalRef = useRef<number | null>(null);
  const blinkCountRef = useRef<number>(0);
  const actionSequenceRef = useRef<string[]>([]);

  // Start liveness check on component mount
  useEffect(() => {
    startLivenessCheck();
    return () => stopAnalysis();
  }, []);

  // Function to start the liveness check process
  const startLivenessCheck = () => {
    setIsAnalyzing(true);
    setProgress(0);
    blinkCountRef.current = 0;
    actionSequenceRef.current = generateActionSequence();
    setInstruction(getNextInstruction() || "");
    analyzeIntervalRef.current = window.setInterval(analyzeFrame, 500);
  };

  // Function to stop the ongoing analysis
  const stopAnalysis = () => {
    setIsAnalyzing(false);
    if (analyzeIntervalRef.current) {
      clearInterval(analyzeIntervalRef.current);
    }
  };

  // Generate a random sequence of actions for liveness check
  const generateActionSequence = (): string[] => {
    const actions = ["left", "right", "blink"];
    return actions.sort(() => 0.5 - Math.random()).slice(0, 3);
  };

  // Handle successful authentication
  // const handleAuthSuccess = () => {
  //   onComplete();
  //   onClose();
  // };

  // Get the next instruction based on the current action
  const getNextInstruction = (): string | JSX.Element | null => {
    const action = actionSequenceRef.current[0];
    if (action === "Verifying...") {
      setShowGif(true);
      return null;
    }

    const instructions: { [key: string]: string | JSX.Element } = {
      right: "Please turn your head to the left",
      left: "Please turn your head to the right",
      blink: (
        <div className="flex items-center">
          <img
            src={Eye}
            alt="Eye Blink"
            className="w-6 h-6 mr-5 ml-20 flex justify-center items-center"
          />
          Please blink twice
        </div>
      ),
    };

    return instructions[action] || null;
  };

  const analyzeFrame = async () => {
    if (!webcamRef.current) return;

    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    const base64Image = imageSrc.split(",")[1];
    const binaryImage = Buffer.from(base64Image, "base64");

    try {
      const detectFacesParams = {
        Image: { Bytes: binaryImage },
        Attributes: ["ALL"] as Attribute[],
      };
      const detectFacesCommand = new DetectFacesCommand(detectFacesParams);
      const detectFacesResult = await rekognitionClient.send(
        detectFacesCommand
      );

      if (
        detectFacesResult.FaceDetails &&
        detectFacesResult.FaceDetails.length > 0
      ) {
        const faceDetails = detectFacesResult.FaceDetails[0];
        const currentAction = actionSequenceRef.current[0];

        if (currentAction === "blink") {
          handleBlinkDetection(faceDetails);
        } else {
          handleHeadMovement(faceDetails, currentAction);
        }

        if (actionSequenceRef.current.length === 0) {
          await handlePhotoLogin(binaryImage);
        }
      } else {
        setTimeout(() => {
          setError("No face detected. Please ensure your face is visible.");
        }, 5000);
      }
    } catch (error) {
      console.error("Error during face analysis:", error);
      setError("Face analysis failed. Please try again.");
    }
  };

  const handleBlinkDetection = (faceDetails: FaceDetails) => {
    if (faceDetails.EyesOpen?.Value === false) {
      blinkCountRef.current++;
      if (blinkCountRef.current >= 2) {
        actionCompleted();
      }
    }
  };

  const handleHeadMovement = (
    faceDetails: FaceDetails,
    expectedAction: string
  ) => {
    const { Pose } = faceDetails;
    const threshold = 15;

    const actionDetected =
      expectedAction === "left"
        ? Pose?.Yaw <= -threshold
        : Pose?.Yaw >= threshold;

    if (actionDetected) {
      actionCompleted();
    }
  };

  // Mark the current action as completed and move to the next
  const actionCompleted = () => {
    actionSequenceRef.current.shift();
    setProgress((prevProgress) => prevProgress + 100 / 3);
    setInstruction(
      actionSequenceRef.current.length > 0
        ? getNextInstruction() || ""
        : "Verifying..."
    );
  };

  // Handle photo login process
  const handlePhotoLogin = async (binaryImage: Buffer) => {
    try {
      // List all user photos in the S3 bucket
      const allUsersParams = {
        Bucket: "face-authen",
        Prefix: "facialdata/profile_images/",
      };
      const listObjectsCommand = new ListObjectsV2Command(allUsersParams);
      const allUsers = await s3Client.send(listObjectsCommand);
      // let faceMatchFound = false;

      if (!allUsers.Contents) {
        throw new Error("No user photos found");
      }

      for (const item of allUsers.Contents) {
        if (!item.Key) continue;

        const getObjectCommand = new GetObjectCommand({
          Bucket: "face-authen",
          Key: item.Key,
        });
        const photoData = await s3Client.send(getObjectCommand);

        if (!photoData.Body) continue;

        const compareFacesParams = {
          SourceImage: { Bytes: binaryImage },
          TargetImage: { Bytes: await photoData.Body.transformToByteArray() },
        };
        const compareFacesCommand = new CompareFacesCommand(compareFacesParams);
        const compareFacesResult = await rekognitionClient.send(
          compareFacesCommand
        );

        if (
          compareFacesResult.FaceMatches &&
          compareFacesResult.FaceMatches.length > 0
        ) {
          const match = compareFacesResult.FaceMatches[0];
          if (match.Face?.Confidence && match.Face.Confidence > 90) {
            stopAnalysis();
            setShowGif(true);
            console.log("Authentication successful");
            return;
          }
        }
      }

      stopAnalysis();
      setError("Face not recognized. Please try again.");
    } catch (err) {
      console.error("Photo login error:", err);
      setError("Photo login failed. Please try again.");
    }
  };

  // Render the component UI
  return (
    <div className=" rounded-2xl overflow-hidden ">
      {!showGif && (
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          className="w-64 h-60 object-cover rounded-2xl flex justify-center items-center"
        />
      )}
      <div className="text-white text-center">
        {isAnalyzing && !showGif && (
          <>
            <div className=" text-white text-lg text-center">
              <div className="mt-2 text-white text-[16px] font-[400] flex justify-center items-center ">
                {instruction}
              </div>
              <div className="w-full h-3 bg-[#282829] rounded-lg overflow-hidden my-3">
                <div
                  className="h-full w-96 bg-gradient-to-r from-pink-500 to-purple-500 transition-width duration-400 ease"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </>
        )}
        {showGif && (
          <div className="rounded-lg flex justify-center items-center">
            <img
              src={Face}
              alt="Verifying"
              className="w-96 h-72 rounded-lg object-fill"
            />
          </div>
        )}
        {error && <div className="text-red-500 my-2 ">{error}</div>}
      </div>
    </div>
  );
};

export default AuthvideoCard;
