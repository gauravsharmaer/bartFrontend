//working optimised code and frt time login
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";
import Eye from "../../assets/eye.svg";
import Face from "../../assets/Face.gif";
import { Button } from "../../components/ui/button";
import { useDispatch } from "react-redux";
import { handleFacialAuth } from "../../redux/authSlice";
import { AppDispatch } from "../../redux/store";

interface ApiError {
  message: string;
}

const REQUIRED_WARMUP_SHOTS = 4;
const MAX_NO_FACE_FRAMES = 10;
const MODEL_URL = "/models";
const API_URL = "http://localhost:4000/api/users/login-with-face";
const BLINK_THRESHOLD = 0.3;
const OPEN_EYE_THRESHOLD = 0.3;
const HEAD_TURN_THRESHOLD = 0.05;
const WARMUP_INTERVAL = 500;
const ANALYSIS_INTERVAL = 500;
// const MIN_DESCRIPTORS = 5; // Minimum number of descriptors needed

type Instructions = {
  right: string;
  left: string;
  blink: JSX.Element;
};

const AuthvideoCard = () => {
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
  const [warmupCount, setWarmupCount] = useState(0);

  const webcamRef = useRef<Webcam>(null);
  const analyzeIntervalRef = useRef<number | null>(null);
  const blinkCountRef = useRef<number>(0);
  const actionSequenceRef = useRef<string[]>([]);
  const noFaceDetectionCountRef = useRef(0);
  const warmupIntervalRef = useRef<number | null>(null);
  const descriptorsRef = useRef<Float32Array[]>([]);
  console.log(faceDescriptors);
  const generateActionSequence = useCallback((): string[] => {
    const actions = ["left", "right", "blink"];
    return actions.sort(() => 0.5 - Math.random()).slice(0, 3);
  }, []);

  const instructions = useMemo<Instructions>(
    () => ({
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
      const leftEye = detections.landmarks.getLeftEye();
      const rightEye = detections.landmarks.getRightEye();

      if (!leftEye.length || !rightEye.length) return;

      const leftEyeAspectRatio = calculateEyeAspectRatio(leftEye, rightEye);
      const rightEyeAspectRatio = calculateEyeAspectRatio(rightEye, leftEye);
      const eyeAspectRatio = (leftEyeAspectRatio + rightEyeAspectRatio) / 2;

      if (eyeAspectRatio < BLINK_THRESHOLD) {
        blinkCountRef.current++;
        if (blinkCountRef.current >= 1) {
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

      const sum = descriptors.reduce((acc, curr) => {
        for (let i = 0; i < curr.length; i++) {
          acc[i] = (acc[i] || 0) + curr[i];
        }
        return acc;
      }, new Array(128).fill(0));

      return sum.map((val) => val / descriptors.length);
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

      const response = await fetch(API_URL, {
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

      await response.json();
      console.log("Login successful");
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
    setIsAnalyzing(false);
    if (analyzeIntervalRef.current) {
      clearInterval(analyzeIntervalRef.current);
      analyzeIntervalRef.current = null;
    }

    if (!warmupIntervalRef.current) {
      warmupIntervalRef.current = window.setInterval(() => {
        void warmupAnalysis();
      }, WARMUP_INTERVAL);
    }
  }, []);

  const analyzeFrame = useCallback(async () => {
    if (!webcamRef.current || isVerifying) return;

    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    try {
      const img = await faceapi.fetchImage(imageSrc);
      const detections = await faceapi
        .detectSingleFace(img)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (detections) {
        noFaceDetectionCountRef.current = 0;
        setError("");
        const currentAction = actionSequenceRef.current[0];

        setFaceDescriptors((prev) => {
          const newDescriptors = [...prev, detections.descriptor];
          descriptorsRef.current = newDescriptors; // Keep ref in sync
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
  }, [isVerifying, handleBlinkDetection, handleHeadMovement]);

  const warmupAnalysis = useCallback(async () => {
    if (!webcamRef.current || !isModelLoaded) return;

    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    try {
      const img = await faceapi.fetchImage(imageSrc);
      await faceapi
        .detectSingleFace(img)
        .withFaceLandmarks()
        .withFaceDescriptor();

      setWarmupCount((prev) => {
        const newCount = prev + 1;
        if (newCount >= REQUIRED_WARMUP_SHOTS && warmupIntervalRef.current) {
          clearInterval(warmupIntervalRef.current);
          warmupIntervalRef.current = null;
        }
        return newCount;
      });
    } catch (error) {
      console.error("Warmup analysis error:", error);
    }
  }, [isModelLoaded]);

  const startLivenessCheck = useCallback(async () => {
    if (!isModelLoaded || !isWebcamReady) {
      setError("Please wait for camera and models to initialize...");
      return;
    }

    if (warmupCount < REQUIRED_WARMUP_SHOTS) {
      setError("Please wait, warming up camera...");
      for (let i = warmupCount; i < REQUIRED_WARMUP_SHOTS; i++) {
        await new Promise((resolve) => setTimeout(resolve, WARMUP_INTERVAL));
        await warmupAnalysis();
      }
    }

    setError("");
    if (warmupIntervalRef.current) {
      clearInterval(warmupIntervalRef.current);
      warmupIntervalRef.current = null;
    }

    setFaceDescriptors([]);
    setIsAnalyzing(true);
    setProgress(0);
    blinkCountRef.current = 0;
    analyzeIntervalRef.current = window.setInterval(
      analyzeFrame,
      ANALYSIS_INTERVAL
    );
    actionSequenceRef.current = generateActionSequence();
    setInstruction(getNextInstruction() || "");
  }, [
    isModelLoaded,
    isWebcamReady,
    warmupCount,
    warmupAnalysis,
    analyzeFrame,
    generateActionSequence,
    getNextInstruction,
  ]);

  useEffect(() => {
    console.log("Component mounted, loading models...");
    const loadModels = async () => {
      try {
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        ]);
        setIsModelLoaded(true);
      } catch (error) {
        console.error("Error loading face-api models:", error);
        setError("Failed to load face recognition models. Please try again.");
      }
    };
    void loadModels();
  }, []);

  useEffect(() => {
    if (
      webcamRef.current?.video &&
      !warmupIntervalRef.current &&
      isModelLoaded
    ) {
      const handleLoadedData = () => {
        setIsWebcamReady(true);
        if (
          !warmupIntervalRef.current &&
          !isAnalyzing &&
          warmupCount < REQUIRED_WARMUP_SHOTS
        ) {
          warmupIntervalRef.current = window.setInterval(() => {
            if (!isAnalyzing) {
              void warmupAnalysis();
            }
          }, WARMUP_INTERVAL);
        }
      };

      webcamRef.current.video.addEventListener("loadeddata", handleLoadedData);
      return () => {
        webcamRef.current?.video?.removeEventListener(
          "loadeddata",
          handleLoadedData
        );
      };
    }
  }, [isModelLoaded, warmupCount, isAnalyzing, warmupAnalysis]);

  useEffect(() => {
    if (warmupCount >= REQUIRED_WARMUP_SHOTS && warmupIntervalRef.current) {
      clearInterval(warmupIntervalRef.current);
      warmupIntervalRef.current = null;
    }
  }, [warmupCount]);

  useEffect(() => {
    return () => {
      if (warmupIntervalRef.current) {
        clearInterval(warmupIntervalRef.current);
      }
      if (analyzeIntervalRef.current) {
        clearInterval(analyzeIntervalRef.current);
      }
    };
  }, []);

  return (
    <div className="rounded-2xl overflow-hidden">
      {/* {warmupCount < REQUIRED_WARMUP_SHOTS && isWebcamReady && (
        <div className="text-sm text-gray-500">
          Warming up camera: {warmupCount}/{REQUIRED_WARMUP_SHOTS}
          <div className="w-full h-2 bg-gray-200 rounded">
            <div
              className="h-full bg-blue-500 rounded transition-all duration-300"
              style={{
                width: `${(warmupCount / REQUIRED_WARMUP_SHOTS) * 100}%`,
              }}
            />
          </div>
        </div>
      )} */}
      {!isAnalyzing && !showGif && (
        <Button
          className="mb-4"
          onClick={startLivenessCheck}
          disabled={
            !isModelLoaded ||
            !isWebcamReady ||
            warmupCount < REQUIRED_WARMUP_SHOTS
          }
        >
          {!isModelLoaded
            ? "Loading Models..."
            : !isWebcamReady
            ? "Initializing Camera..."
            : warmupCount < REQUIRED_WARMUP_SHOTS
            ? `Warming up camera (${warmupCount}/${REQUIRED_WARMUP_SHOTS})`
            : "Start Liveness Check"}
        </Button>
      )}
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
            <div className="text-white text-lg text-center">
              <div className="mt-2 text-white text-[16px] font-[400] flex justify-center items-center">
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
        {error && <div className="text-red-500 my-2">{error}</div>}
      </div>
    </div>
  );
};

export default AuthvideoCard;
