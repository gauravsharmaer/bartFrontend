import React, { useState, useRef, useEffect } from "react";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import Webcam from "react-webcam";
import { Buffer } from "buffer";
import Eye from "../../assets/eye.svg";
import Face from "../../assets/Face.gif";
import {
  REACT_APP_AWS_ACCESS_KEY_ID,
  REACT_APP_AWS_SECRET_ACCESS_KEY,
  REACT_APP_AWS_REGION,
} from "../../config";

// Configure AWS SDK
const s3Client = new S3Client({
  region: REACT_APP_AWS_REGION,
  credentials: {
    accessKeyId: REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: REACT_APP_AWS_SECRET_ACCESS_KEY,
  },
});

// const s3 = new AWS.S3();
// const rekognition = new AWS.Rekognition();

const FacialAuthComponent = ({ link, onClose, onComplete }) => {
  const [error, setError] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [instruction, setInstruction] = useState("");
  const [progress, setProgress] = useState(0);
  const [showGif, setShowGif] = useState(false);

  const webcamRef = useRef(null);
  const analyzeIntervalRef = useRef(null);
  const blinkCountRef = useRef(0);
  const actionSequenceRef = useRef([]);

  useEffect(() => {
    startLivenessCheck();
    return () => stopAnalysis();
  }, []);

  const startLivenessCheck = () => {
    setIsAnalyzing(true);
    setProgress(0);
    blinkCountRef.current = 0;
    actionSequenceRef.current = generateActionSequence();
    setInstruction(getNextInstruction());
    analyzeIntervalRef.current = setInterval(analyzeFrame, 500);
  };

  const stopAnalysis = () => {
    setIsAnalyzing(false);
    if (analyzeIntervalRef.current) {
      clearInterval(analyzeIntervalRef.current);
    }
  };

  const generateActionSequence = () => {
    const actions = ["left", "right", "blink"];
    return actions.sort(() => 0.5 - Math.random()).slice(0, 3);
  };

  const handleAuthSuccess = () => {
    if (onComplete && typeof onComplete === "function") {
      onComplete();
    }
    handleClose(); // Automatically close after successful verification
  };

  const handleClose = () => {
    if (onClose && typeof onClose === "function") {
      onClose();
    }
  };

  const getNextInstruction = () => {
    const action = actionSequenceRef.current[0];
    if (action === "Verifying...") {
      setShowGif(true);
      return null;
    }

    switch (action) {
      case "right":
        return "Please turn your head to the left";
      case "left":
        return "Please turn your head to the right";
      case "blink":
        return (
          <div className="flex items-center">
            <img
              src={Eye}
              alt="Eye Blink"
              className="w-6 h-6 mr-5 ml-20 flex justify-center items-center"
            />
            Please blink twice
          </div>
        );
      default:
        return null;
    }
  };

  const analyzeFrame = async () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        const base64Image = imageSrc.split(",")[1];
        const binaryImage = Buffer.from(base64Image, "base64");

        try {
          const detectFacesParams = {
            Image: { Bytes: binaryImage },
            Attributes: ["ALL"],
          };
          const detectFacesResult = await rekognition
            .detectFaces(detectFacesParams)
            .promise();

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
      }
    }
  };

  const handleBlinkDetection = (faceDetails) => {
    if (faceDetails.EyesOpen.Value === false) {
      blinkCountRef.current++;
      if (blinkCountRef.current >= 2) {
        actionCompleted();
      }
    }
  };

  const handleHeadMovement = (faceDetails, expectedAction) => {
    const { Pose } = faceDetails;
    const threshold = 15; // degrees

    let actionDetected = false;

    switch (expectedAction) {
      case "left":
        actionDetected = Pose.Yaw <= -threshold;
        break;
      case "right":
        actionDetected = Pose.Yaw >= threshold;
        break;
    }

    if (actionDetected) {
      actionCompleted();
    }
  };

  const actionCompleted = () => {
    actionSequenceRef.current.shift();
    setProgress((prevProgress) => prevProgress + 100 / 3);
    if (actionSequenceRef.current.length > 0) {
      setInstruction(getNextInstruction());
    } else {
      setInstruction("Verifying...");
    }
  };

  const handlePhotoLogin = async (binaryImage) => {
    try {
      const allUsersParams = {
        Bucket: "face-authen",
        Prefix: "facialdata/profile_images/",
      };
      const allUsers = await s3.listObjectsV2(allUsersParams).promise();
      let faceMatchFound = false;

      for (let item of allUsers.Contents) {
        const photoKey = item.Key;
        const photoData = await s3
          .getObject({ Bucket: "face-authen", Key: photoKey })
          .promise();

        const compareFacesParams = {
          SourceImage: { Bytes: binaryImage },
          TargetImage: { Bytes: photoData.Body },
        };

        const compareFacesResult = await rekognition
          .compareFaces(compareFacesParams)
          .promise();

        if (
          compareFacesResult.FaceMatches &&
          compareFacesResult.FaceMatches.length > 0
        ) {
          const match = compareFacesResult.FaceMatches[0];
          if (match.Face.Confidence > 90) {
            faceMatchFound = true;
            break;
          }
        }
      }

      if (faceMatchFound) {
        stopAnalysis();
        setShowGif(true);
        setTimeout(() => {
          handleAuthSuccess();
        }, 6000);
      } else {
        stopAnalysis();
        setError("Face not recognized. Please try again.");
      }
    } catch (err) {
      console.error("Photo login error:", err);
      setError("Photo login failed. Please try again.");
    }
  };

  return (
    <div className="p-10 rounded-2xl overflow-hidden bg-gray-800">
      {!showGif && (
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          className="w-100 h-75 object-cover rounded-2xl"
        />
      )}
      <div className="text-white text-center">
        {isAnalyzing && !showGif && (
          <>
            <div className="mt-4 text-white text-lg text-center">
              <div className="mt-4 text-white text-lg text-center">
                {instruction}
              </div>
              <div className="w-full h-3 bg-black rounded-lg overflow-hidden my-3">
                <div
                  className="h-full bg-gradient-to-r from-pink-500 to-purple-500 transition-width duration-400 ease"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </>
        )}
        {showGif && (
          <div className="rounded-lg">
            <img
              src={Face}
              alt="Verifying"
              className="w-100 h-75 rounded-lg object-fill"
            />
          </div>
        )}
        {error && <div className="text-red-500 my-2">{error}</div>}
      </div>
    </div>
  );
};

export default FacialAuthComponent;
