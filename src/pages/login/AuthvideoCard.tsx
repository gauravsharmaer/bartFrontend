//authproper new good working
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";
import Eye from "../../assets/eye.svg";
import Face from "../../assets/Face.gif";

import { useDispatch } from "react-redux";
import { handleFacialAuth } from "../../redux/authSlice";
import { AppDispatch } from "../../redux/store";
import { TinyFaceDetectorOptions } from "face-api.js";
import debounce from "lodash/debounce";
import { modelLoadingState } from "../../utils/modelState";
import { NODE_API_URL } from "../../config";
interface ApiError {
  message: string;
}

const MAX_NO_FACE_FRAMES = 10;
// const MODEL_URL = "/models";
const API_URL_FACE = `${NODE_API_URL}/login-with-face`;
const BLINK_THRESHOLD = 0.3;
const OPEN_EYE_THRESHOLD = 0.4;
const HEAD_TURN_THRESHOLD = 0.02;
const ANALYSIS_INTERVAL = 500;
const ANALYSIS_OPTIONS = new TinyFaceDetectorOptions({ inputSize: 224 });

type Instructions = {
  right: string;
  left: string;
  blink: JSX.Element;
};

interface VerifyAuthProps {
  onVerificationComplete?: () => void;
}

const AuthvideoCard: React.FC<VerifyAuthProps> = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [error, setError] = useState("");
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [instruction, setInstruction] = useState<string | JSX.Element>("");
  const [progress, setProgress] = useState(0);
  const [showGif, setShowGif] = useState(false);
  const [faceDescriptors, setFaceDescriptors] = useState<Float32Array[]>([]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isWebcamReady, setIsWebcamReady] = useState(false);
  const [showCamera, setShowCamera] = useState(true);

  const webcamRef = useRef<Webcam>(null);
  const analyzeIntervalRef = useRef<number | null>(null);
  const blinkCountRef = useRef<number>(0);
  const actionSequenceRef = useRef<string[]>([]);
  const noFaceDetectionCountRef = useRef(0);
  const descriptorsRef = useRef<Float32Array[]>([]);
  console.log(faceDescriptors);
  const generateActionSequence = useCallback((): string[] => {
    console.log("generateActionSequence called");
    return ["left", "right", "blink"];
  }, []);

  const instructions = useMemo<Instructions>(
    () => ({
      left: "Please slowly turn your head right ➡️",
      right: "Please slowly turn your head left ⬅️",
      blink: (
        <div className="flex items-center">
          <img
            src={Eye}
            alt="Eye Blink"
            className="w-6 h-6 mr-5 ml-20 flex justify-center items-center"
          />
          Please blink once
        </div>
      ),
    }),
    []
  );

  const getNextInstruction = useCallback((): string | JSX.Element | null => {
    const action = actionSequenceRef.current[0];
    if (action === "Verifying...") {
      setShowGif(true);
      return null;
    }

    return instructions[action as keyof Instructions] || null;
  }, [instructions]);

  const actionCompleted = useCallback(() => {
    actionSequenceRef.current.shift();
    setProgress((prevProgress) => {
      const newProgress = prevProgress + 100 / 3;
      return newProgress;
    });

    if (actionSequenceRef.current.length > 0) {
      setInstruction(getNextInstruction() || "");
    } else {
      setInstruction("Verifying...");
      setIsVerifying(true);
      stopAnalysis();
      void handlePhotoLogin();
    }
    blinkCountRef.current = 0;
  }, [getNextInstruction]);

  const calculateEyeAspectRatio = useCallback(
    (eye: faceapi.Point[], otherEye: faceapi.Point[]): number => {
      console.log("calculateEyeAspectRatio called");
      if (eye.length < 6 || otherEye.length < 6) return 1;

      try {
        const eyeWidth = faceapi.euclideanDistance(
          [eye[0].x, eye[0].y],
          [eye[3].x, eye[3].y]
        );
        const eyeHeight1 = faceapi.euclideanDistance(
          [eye[1].x, eye[1].y],
          [eye[5].x, eye[5].y]
        );
        const eyeHeight2 = faceapi.euclideanDistance(
          [eye[2].x, eye[2].y],
          [eye[4].x, eye[4].y]
        );

        return (eyeHeight1 + eyeHeight2) / (2 * eyeWidth);
      } catch (error) {
        console.error("Error calculating eye aspect ratio:", error);
        return 1;
      }
    },
    []
  );

  const handleBlinkDetection = useCallback(
    (
      detections: faceapi.WithFaceLandmarks<
        { detection: faceapi.FaceDetection },
        faceapi.FaceLandmarks68
      > &
        faceapi.WithFaceDescriptor<
          faceapi.WithFaceLandmarks<
            { detection: faceapi.FaceDetection },
            faceapi.FaceLandmarks68
          >
        >
    ) => {
      console.log("handleBlinkDetection called");
      const leftEye = detections.landmarks.getLeftEye();
      const rightEye = detections.landmarks.getRightEye();

      if (!leftEye.length || !rightEye.length) return;

      const leftEyeAspectRatio = calculateEyeAspectRatio(leftEye, rightEye);
      const rightEyeAspectRatio = calculateEyeAspectRatio(rightEye, leftEye);
      const eyeAspectRatio = (leftEyeAspectRatio + rightEyeAspectRatio) / 2;

      if (eyeAspectRatio < BLINK_THRESHOLD) {
        blinkCountRef.current++;
        if (blinkCountRef.current >= 2) {
          actionCompleted();
        }
      } else if (eyeAspectRatio > OPEN_EYE_THRESHOLD) {
        blinkCountRef.current = 0;
      }
    },
    [calculateEyeAspectRatio, actionCompleted]
  );

  const handleHeadMovement = useCallback(
    (
      detections: faceapi.WithFaceLandmarks<
        { detection: faceapi.FaceDetection },
        faceapi.FaceLandmarks68
      > &
        faceapi.WithFaceDescriptor<
          faceapi.WithFaceLandmarks<
            { detection: faceapi.FaceDetection },
            faceapi.FaceLandmarks68
          >
        >,
      expectedAction: string
    ) => {
      console.log("handleHeadMovement called");
      const jawOutline = detections.landmarks.getJawOutline();
      const nose = detections.landmarks.getNose();
      const jawCenter = jawOutline[8];
      const noseTop = nose[0];

      const headTurn =
        (jawCenter.x - noseTop.x) / detections.detection.box.width;
      const actionDetected =
        expectedAction === "left"
          ? headTurn >= HEAD_TURN_THRESHOLD
          : headTurn <= -HEAD_TURN_THRESHOLD;

      if (actionDetected) {
        actionCompleted();
      }
    },
    [actionCompleted]
  );

  const calculateAverageDescriptor = useCallback(
    (descriptors: Float32Array[]): number[] => {
      if (descriptors.length === 0) return [];

      const length = descriptors[0].length;
      const sum = new Float32Array(length);

      for (let i = 0; i < descriptors.length; i++) {
        const descriptor = descriptors[i];
        for (let j = 0; j < length; j++) {
          sum[j] += descriptor[j];
        }
      }

      return Array.from(sum.map((val) => val / descriptors.length));
    },
    []
  );

  const handlePhotoLogin = useCallback(async () => {
    try {
      setIsVerifying(true);
      console.log("Starting login process...");

      // Initial wait
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Get descriptors from ref
      let currentDescriptors = descriptorsRef.current;
      console.log(`Initial descriptors count: ${currentDescriptors.length}`);

      const startTime = Date.now();
      const TIMEOUT = 9000;
      const MIN_DESCRIPTORS = 5;

      while (currentDescriptors.length < MIN_DESCRIPTORS) {
        if (Date.now() - startTime > TIMEOUT) {
          currentDescriptors = descriptorsRef.current; // One final check
          if (currentDescriptors.length < MIN_DESCRIPTORS) {
            console.log(
              `Timeout reached with ${currentDescriptors.length} descriptors`
            );
            throw new Error(
              `Insufficient descriptors: ${currentDescriptors.length}`
            );
          }
          break;
        }
        await new Promise((resolve) => setTimeout(resolve, 100));
        currentDescriptors = descriptorsRef.current;
        console.log(
          `Waiting... Current descriptors: ${currentDescriptors.length}`
        );
      }

      console.log(`Proceeding with ${currentDescriptors.length} descriptors`);
      const averageDescriptor = calculateAverageDescriptor(currentDescriptors);

      const response = await fetch(API_URL_FACE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          faceDescriptor: averageDescriptor,
        }),
      });

      if (!response.ok) {
        const errorData = (await response.json()) as ApiError;
        throw new Error(errorData.message || "Login failed");
      }

      const result = await response.json();
      localStorage.setItem("user_id", result.user_id);
      localStorage.setItem("name", result.name);
      localStorage.setItem("email", result.email);
      localStorage.setItem("isFaceVerified", result.isFaceVerified);
      console.log("Login successful");
      setShowCamera(false);
      setFaceDescriptors([]);
      descriptorsRef.current = []; // Clear ref as well
      dispatch(handleFacialAuth(true));
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Photo login failed. Please try again.";
      setError(errorMessage);
      console.error("Photo login error:", error);
    } finally {
      setIsVerifying(false);
    }
  }, [dispatch, calculateAverageDescriptor]); // Note: removed faceDescriptors dependency

  const stopAnalysis = useCallback(() => {
    console.log("Stopping analysis");
    setIsAnalyzing(false);
    if (analyzeIntervalRef.current) {
      clearInterval(analyzeIntervalRef.current);
      analyzeIntervalRef.current = null;
    }
  }, []);

  const debouncedAnalyzeFrame = useCallback(
    debounce(async () => {
      if (!webcamRef.current || isVerifying) return;

      try {
        const video = webcamRef.current.video;
        if (!video) return;

        const detections = await faceapi
          .detectSingleFace(video, ANALYSIS_OPTIONS)
          .withFaceLandmarks(true)
          .withFaceDescriptor();

        if (detections) {
          noFaceDetectionCountRef.current = 0;
          setError("");
          const currentAction = actionSequenceRef.current[0];

          setFaceDescriptors((prev) => {
            const newDescriptors = [...prev, detections.descriptor];
            descriptorsRef.current = newDescriptors;
            return newDescriptors;
          });

          if (currentAction === "blink") {
            handleBlinkDetection(detections);
          } else if (currentAction === "left" || currentAction === "right") {
            handleHeadMovement(detections, currentAction);
          }
        } else {
          noFaceDetectionCountRef.current++;
          if (noFaceDetectionCountRef.current >= MAX_NO_FACE_FRAMES) {
            setError("No face detected. Please ensure your face is visible.");
          }
        }
      } catch (error) {
        console.error("Error during face analysis:", error);
        setError("Face analysis failed. Please try again.");
      }
    }, 50),
    [isVerifying, handleBlinkDetection, handleHeadMovement]
  );

  useEffect(() => {
    // Check if models are already loaded
    if (modelLoadingState.isLoaded) {
      setIsModelLoaded(true);
    } else {
      // Check periodically if models are loaded
      const checkInterval = setInterval(() => {
        if (modelLoadingState.isLoaded) {
          setIsModelLoaded(true);
          clearInterval(checkInterval);
        }
        if (modelLoadingState.error) {
          setError(modelLoadingState.error);
          clearInterval(checkInterval);
        }
      }, 100);

      return () => clearInterval(checkInterval);
    }
  }, []);

  useEffect(() => {
    if (webcamRef.current?.video && isModelLoaded) {
      const handleLoadedData = () => {
        setIsWebcamReady(true);
      };

      webcamRef.current.video.addEventListener("loadeddata", handleLoadedData);
      return () => {
        webcamRef.current?.video?.removeEventListener(
          "loadeddata",
          handleLoadedData
        );
      };
    }
  }, [isModelLoaded]);

  useEffect(() => {
    return () => {
      if (analyzeIntervalRef.current) {
        clearInterval(analyzeIntervalRef.current);
      }
    };
  }, []);

  const videoConstraints = useMemo(
    () => ({
      width: 640,
      height: 480,
      facingMode: "user",
      frameRate: { ideal: 30 },
    }),
    []
  );

  const webcamComponent = useMemo(
    () => (
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
        className="object-cover rounded-2xl flex justify-center items-center bg-gray-100"
        mirrored={true}
      />
    ),
    [videoConstraints]
  );

  useEffect(() => {
    // Start automatically when both webcam and models are ready
    if (isModelLoaded && isWebcamReady && !isAnalyzing && !showGif) {
      console.log("Auto-starting liveness check...");
      setError("");
      setFaceDescriptors([]);
      setIsAnalyzing(true);
      setProgress(0);
      blinkCountRef.current = 0;
      analyzeIntervalRef.current = window.setInterval(
        debouncedAnalyzeFrame,
        ANALYSIS_INTERVAL
      );
      actionSequenceRef.current = generateActionSequence();
      setInstruction(getNextInstruction() || "");
    }
  }, [
    isModelLoaded,
    isWebcamReady,
    isAnalyzing,
    showGif,
    debouncedAnalyzeFrame,
    generateActionSequence,
    getNextInstruction,
  ]);

  return (
    <div className="rounded-2xl overflow-hidden">
      {!isAnalyzing && !showGif && (
        <div className="flex flex-col items-center gap-2 ">
          {!isModelLoaded ? (
            <>
              <div className="flex items-center gap-2 mb-4">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-purple-500 border-t-transparent" />
                <span className="text-white">Loading ...</span>
              </div>
            </>
          ) : !isWebcamReady ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 animate-pulse rounded-full" />
              <span className="text-white">Initializing Camera...</span>
            </div>
          ) : null}
        </div>
      )}

      {!showGif && showCamera && (
        <div className="relative w-64 h-52">
          {webcamComponent}
          {!isWebcamReady && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-2xl">
              <div className="animate-pulse flex space-x-4">
                <div className="rounded-full bg-slate-700 h-10 w-10"></div>
                <div className="flex-1 space-y-6 py-1">
                  <div className="h-2 bg-slate-700 rounded"></div>
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="h-2 bg-slate-700 rounded col-span-2"></div>
                      <div className="h-2 bg-slate-700 rounded col-span-1"></div>
                    </div>
                    <div className="h-2 bg-slate-700 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="text-white text-center">
        {isAnalyzing &&
        isModelLoaded &&
        faceDescriptors.length > 0 &&
        descriptorsRef.current.length > 0 ? (
          <>
            <div className="text-white text-lg text-center ">
              <div className="text-white text-[14px] font-[400] flex justify-center items-center">
                {instruction}
              </div>
              <div className="w-full h-3 bg-[#282829] rounded-lg overflow-hidden my-1">
                <div
                  className="h-full w-96 bg-gradient-to-r from-pink-500 to-purple-500 transition-width duration-400 ease"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-white text-[14px] font-[400] flex justify-center items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-purple-500 border-t-transparent" />
            <span className="text-white">Initializing face detection...</span>
          </div>
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
        {error && <div className="text-red-500 my-2">{error}</div>}
      </div>
    </div>
  );
};

export default AuthvideoCard;

//function recreation diagram

// +---------------------+
// | getNextInstruction  |
// +---------------------+
//            |
//            v
// +---------------------+
// |   actionCompleted    |
// +---------------------+
//            |
// +----------+----------+
// |                     |
// v                     v
// +---------------------+  +---------------------+
// | handleHeadMovement  |  | handleBlinkDetection |
// +---------------------+  +---------------------+
//                    |
//                    v
//       +---------------------------+
//       | calculateEyeAspectRatio   |
//       +---------------------------+

// +---------------------+
// | dispatch            |
// | calculateAverageDescriptor |
// +---------------------+
//            |
//            v
// +---------------------+
// |   handlePhotoLogin   |
// +---------------------+

// +---------------------+
// | startLivenessCheck  |
// +---------------------+
//            |
//            v
// +---------------------+
// |   analyzeFrame      |
// +---------------------+

// +---------------------+
