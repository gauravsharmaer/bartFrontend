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
import { AUTH_MODES } from "./authConfig";

// Constants
const MAX_NO_FACE_FRAMES = 10;
const MODEL_URL = "/models";
const BLINK_THRESHOLD = 0.3;
const OPEN_EYE_THRESHOLD = 0.4;
const HEAD_TURN_THRESHOLD = 0.04;
const ANALYSIS_INTERVAL = 500;
const ANALYSIS_OPTIONS = new TinyFaceDetectorOptions({ inputSize: 224 });

interface ApiError {
  message: string;
}

type Instructions = {
  right: string;
  left: string;
  blink: JSX.Element;
};

interface AuthVideoCardProps {
  onVerificationComplete?: () => void;
  mode: "capture" | "verify";
}

export const AuthVideoCard: React.FC<AuthVideoCardProps> = ({
  onVerificationComplete,
  mode,
}) => {
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

  const generateActionSequence = useCallback((): string[] => {
    console.log("generateActionSequence called");
    return ["left", "right", "blink"];
  }, []);

  const instructions = useMemo<Instructions>(
    () => ({
      right: "Please slowly turn your head to the left ⬅️",
      left: "Please slowly turn your head to the right ➡️",
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
    setProgress((prevProgress) => prevProgress + 100 / 3);

    if (actionSequenceRef.current.length > 0) {
      setInstruction(getNextInstruction() || "");
    } else {
      setInstruction("Verifying...");
      setIsVerifying(true);
      stopAnalysis();
      void handleVerification();
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

  //   const handleBlinkDetection = useCallback(
  //     (
  //       detections: faceapi.WithFaceLandmarks<
  //         { detection: faceapi.FaceDetection },
  //         faceapi.FaceLandmarks68
  //       > &
  //         faceapi.WithFaceDescriptor<any>
  //     ) => {
  //       const leftEye = detections.landmarks.getLeftEye();
  //       const rightEye = detections.landmarks.getRightEye();

  //       if (!leftEye.length || !rightEye.length) return;

  //       const leftEyeAspectRatio = calculateEyeAspectRatio(leftEye, rightEye);
  //       const rightEyeAspectRatio = calculateEyeAspectRatio(rightEye, leftEye);
  //       const eyeAspectRatio = (leftEyeAspectRatio + rightEyeAspectRatio) / 2;

  //       if (eyeAspectRatio < BLINK_THRESHOLD) {
  //         blinkCountRef.current++;
  //         if (blinkCountRef.current >= 1) {
  //           actionCompleted();
  //         }
  //       } else if (eyeAspectRatio > OPEN_EYE_THRESHOLD) {
  //         blinkCountRef.current = 0;
  //       }
  //     },
  //     [calculateEyeAspectRatio, actionCompleted]
  //   );

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
        if (blinkCountRef.current >= 1) {
          actionCompleted();
        }
      } else if (eyeAspectRatio > OPEN_EYE_THRESHOLD) {
        blinkCountRef.current = 0;
      }
    },
    [calculateEyeAspectRatio, actionCompleted]
  );

  //   const handleHeadMovement = useCallback(
  //     (
  //       detections: faceapi.WithFaceLandmarks<
  //         { detection: faceapi.FaceDetection },
  //         faceapi.FaceLandmarks68
  //       > &
  //         faceapi.WithFaceDescriptor<any>,
  //       expectedAction: string
  //     ) => {
  //       const jawOutline = detections.landmarks.getJawOutline();
  //       const nose = detections.landmarks.getNose();
  //       const jawCenter = jawOutline[8];
  //       const noseTop = nose[0];

  //       const headTurn =
  //         (jawCenter.x - noseTop.x) / detections.detection.box.width;
  //       const actionDetected =
  //         expectedAction === "left"
  //           ? headTurn >= HEAD_TURN_THRESHOLD
  //           : headTurn <= -HEAD_TURN_THRESHOLD;

  //       if (actionDetected) {
  //         actionCompleted();
  //       }
  //     },
  //     [actionCompleted]
  //   );

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

      for (const descriptor of descriptors) {
        for (let j = 0; j < length; j++) {
          sum[j] += descriptor[j];
        }
      }

      return Array.from(sum.map((val) => val / descriptors.length));
    },
    []
  );

  const handleVerification = useCallback(async () => {
    try {
      setIsVerifying(true);
      const currentDescriptors = descriptorsRef.current;

      if (currentDescriptors.length < 5) {
        throw new Error(
          `Insufficient descriptors: ${currentDescriptors.length}`
        );
      }

      const averageDescriptor = calculateAverageDescriptor(currentDescriptors);
      const userId = localStorage.getItem("user_id");
      if (!userId) throw new Error("User ID not found");

      const response = await fetch(AUTH_MODES[mode].apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          userId,
          faceDescriptor: averageDescriptor,
        }),
      });

      if (!response.ok) {
        const errorData = (await response.json()) as ApiError;
        throw new Error(errorData.message || "Verification failed");
      }

      const result = await response.json();

      if (AUTH_MODES[mode].successCheck(result)) {
        dispatch(handleFacialAuth(true));
        setShowCamera(false);
        AUTH_MODES[mode].onSuccess();
        onVerificationComplete?.();
        setFaceDescriptors([]);
        descriptorsRef.current = [];
      } else {
        throw new Error("Face verification failed - no match found");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Verification failed. Please try again.";
      setError(errorMessage);
      console.error("Verification error:", error);
    } finally {
      setIsVerifying(false);
    }
  }, [mode, dispatch, calculateAverageDescriptor, onVerificationComplete]);

  const stopAnalysis = useCallback(() => {
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
    const loadModels = async () => {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68TinyNet.loadFromUri(MODEL_URL),
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

  //   useEffect(() => {
  //     if (webcamRef.current?.video && isModelLoaded) {
  //       const handleLoadedData = () => setIsWebcamReady(true);
  //       webcamRef.current.video.addEventListener("loadeddata", handleLoadedData);
  //       return () => {
  //         webcamRef.current?.video?.removeEventListener(
  //           "loadeddata",
  //           handleLoadedData
  //         );
  //       };
  //     }
  //   }, [isModelLoaded]);

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
    if (isModelLoaded && isWebcamReady && !isAnalyzing && !showGif) {
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

  useEffect(() => {
    return () => {
      if (analyzeIntervalRef.current) {
        clearInterval(analyzeIntervalRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col space-y-4 w-[450px]">
      <div className="w-full bg-[#2C2C2E] rounded-xl">
        {!isAnalyzing && !showGif && (
          <div className="flex flex-col items-center gap-2">
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
          <div className="relative w-full aspect-video rounded-lg overflow-hidden ring-2 ring-purple-500/30">
            <div className="absolute inset-0 bg-gradient-to-t from-purple-500/10 to-transparent pointer-events-none" />
            {webcamComponent}
            {!isWebcamReady && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
                <div className="animate-pulse flex space-x-4">
                  <div className="rounded-full bg-slate-700 h-5 w-5"></div>
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
        {showGif && (
          <div className="w-full rounded-lg flex justify-center items-center overflow-hidden ring-2 ring-purple-500/30">
            <img
              src={Face}
              alt="Verifying"
              className="w-full aspect-video rounded-lg object-cover"
            />
          </div>
        )}
      </div>
      <div className="w-full bg-[#2C2C2E] rounded-lg px-2 py-2">
        <div className="text-white text-center">
          {isAnalyzing &&
          isModelLoaded &&
          faceDescriptors.length > 0 &&
          descriptorsRef.current.length > 0 ? (
            <div className="space-y-3">
              <div className="text-[16px] font-[200] flex justify-center items-center">
                {instruction}
              </div>
              <div className="w-full h-3 bg-[#282829] rounded-lg overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-pink-500 to-purple-500 transition-width duration-400 ease"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          ) : (
            <div className="text-[14px] font-[400] flex justify-center items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-purple-500 border-t-transparent" />
              <span>Initializing face detection...</span>
            </div>
          )}
          {error && <div className="text-red-500 mt-2">{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default AuthVideoCard;
