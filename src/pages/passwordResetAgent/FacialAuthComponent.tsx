import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import { Buffer } from "buffer";
import Eye from "../../assets/eye.svg";
import Face from "../../assets/Face.gif";
import {
  REACT_APP_AWS_ACCESS_KEY_ID,
  REACT_APP_AWS_SECRET_ACCESS_KEY,
  REACT_APP_AWS_REGION,
} from "../../config";
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

const s3Client = new S3Client({
  region: REACT_APP_AWS_REGION,
  credentials: {
    accessKeyId: REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: REACT_APP_AWS_SECRET_ACCESS_KEY,
  },
});

const rekognitionClient = new RekognitionClient({
  region: REACT_APP_AWS_REGION,
  credentials: {
    accessKeyId: REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: REACT_APP_AWS_SECRET_ACCESS_KEY,
  },
});

interface FacialAuthComponentProps {
  onClose: () => void;
  onComplete: () => void;
}

const FacialAuthComponent: React.FC<FacialAuthComponentProps> = ({
  onClose,
  onComplete,
}) => {
  const [error, setError] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [instruction, setInstruction] = useState<string | JSX.Element>("");
  const [progress, setProgress] = useState<number>(0);
  const [showGif, setShowGif] = useState<boolean>(false);

  const webcamRef = useRef<Webcam>(null);
  const analyzeIntervalRef = useRef<number | null>(null);
  const blinkCountRef = useRef<number>(0);
  const actionSequenceRef = useRef<string[]>([]);

  useEffect(() => {
    startLivenessCheck();
    return () => stopAnalysis();
  }, []);

  const startLivenessCheck = (): void => {
    setIsAnalyzing(true);
    setProgress(0);
    blinkCountRef.current = 0;
    actionSequenceRef.current = generateActionSequence();
    setInstruction(getNextInstruction());
    analyzeIntervalRef.current = window.setInterval(analyzeFrame, 500);
  };

  const stopAnalysis = (): void => {
    setIsAnalyzing(false);
    if (analyzeIntervalRef.current) {
      clearInterval(analyzeIntervalRef.current);
    }
  };

  const generateActionSequence = (): string[] => {
    const actions = ["left", "right", "blink"];
    return actions.sort(() => 0.5 - Math.random()).slice(0, 3);
  };

  const handleAuthSuccess = (): void => {
    if (onComplete && typeof onComplete === "function") {
      onComplete();
    }
    handleClose();
  };

  const handleClose = (): void => {
    if (onClose && typeof onClose === "function") {
      onClose();
    }
  };

  const getNextInstruction = (): string | JSX.Element => {
    const action = actionSequenceRef.current[0];
    if (action === "Verifying...") {
      setShowGif(true);
      return "Verifying...";
    }

    switch (action) {
      case "right":
        return "Please turn your head to the left";
      case "left":
        return "Please turn your head to the right";
      case "blink":
        return (
          <div className="flex items-center">
            <img src={Eye} alt="Eye Blink" className="w-6 h-6 mr-5 ml-20" />
            Please blink twice
          </div>
        );
      default:
        return "Preparing...";
    }
  };

  const analyzeFrame = async (): Promise<void> => {
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
          const detectFacesResult = await rekognitionClient.send(
            new DetectFacesCommand(detectFacesParams)
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
      }
    }
  };

  const handleBlinkDetection = (
    faceDetails: AWS.Rekognition.FaceDetail
  ): void => {
    if (faceDetails.EyesOpen && faceDetails.EyesOpen.Value === false) {
      blinkCountRef.current++;
      if (blinkCountRef.current >= 2) {
        actionCompleted();
      }
    }
  };

  const handleHeadMovement = (
    faceDetails: AWS.Rekognition.FaceDetail,
    expectedAction: string
  ): void => {
    const { Pose } = faceDetails;
    const threshold = 15; // degrees

    let actionDetected = false;

    if (Pose && Pose.Yaw !== undefined) {
      switch (expectedAction) {
        case "left":
          actionDetected = Pose.Yaw <= -threshold;
          break;
        case "right":
          actionDetected = Pose.Yaw >= threshold;
          break;
      }
    }

    if (actionDetected) {
      actionCompleted();
    }
  };

  const actionCompleted = (): void => {
    actionSequenceRef.current.shift();
    setProgress((prevProgress) => prevProgress + 100 / 3);
    if (actionSequenceRef.current.length > 0) {
      setInstruction(getNextInstruction());
    } else {
      setInstruction("Verifying...");
    }
  };

  const handlePhotoLogin = async (binaryImage: Buffer): Promise<void> => {
    try {
      const allUsersParams = {
        Bucket: "face-authen",
        Prefix: "facialdata/profile_images/",
      };
      const allUsers = await s3Client.send(
        new ListObjectsV2Command(allUsersParams)
      );
      let faceMatchFound = false;

      if (allUsers.Contents) {
        for (const item of allUsers.Contents) {
          const photoKey = item.Key;
          if (photoKey) {
            const photoData = await s3Client.send(
              new GetObjectCommand({ Bucket: "face-authen", Key: photoKey })
            );

            if (photoData.Body) {
              const compareFacesParams = {
                SourceImage: { Bytes: binaryImage },
                TargetImage: { Bytes: await streamToBuffer(photoData.Body) },
              };

              const compareFacesResult = await rekognitionClient.send(
                new CompareFacesCommand(compareFacesParams)
              );

              if (
                compareFacesResult.FaceMatches &&
                compareFacesResult.FaceMatches.length > 0
              ) {
                const match = compareFacesResult.FaceMatches[0];
                if (
                  match.Face &&
                  match.Face.Confidence &&
                  match.Face.Confidence > 90
                ) {
                  faceMatchFound = true;
                  break;
                }
              }
            }
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

  async function streamToBuffer(stream: ReadableStream): Promise<Buffer> {
    const chunks = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    return Buffer.concat(chunks);
  }

  return (
    <div className="p-10 rounded-3xl overflow-hidden bg-[#292929]">
      {!showGif && (
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          className="w-[400px] h-[300px] object-cover rounded-3xl"
        />
      )}
      <div className="text-center text-white">
        {isAnalyzing && !showGif && (
          <>
            <div className="mt-4 text-base">{instruction}</div>
            <div className="mt-3">
              <div className="w-full h-3 bg-black rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#e189b0] to-[#6b1df5] transition-all duration-400 ease-in-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </>
        )}
        {showGif && (
          <div className="rounded-2xl">
            <img
              src={Face}
              alt="Verifying"
              className="w-[400px] h-[300px] rounded-2xl object-fill"
            />
          </div>
        )}
        {error && <div className="text-red-500 mt-2.5">{error}</div>}
      </div>
    </div>
  );
};

export default FacialAuthComponent;
